import axios from 'axios';
import { Builder, parseStringPromise } from 'xml2js';

type Customer = {
  id: string;
  secure_key: string;
};

export class QloService {
  private apiKey = process.env.QLO_API_KEY!;
  private apiUrl = process.env.QLO_API_URL!;
  private builder = new Builder({ renderOpts: { pretty: false } });

  /**
   * MAIN FLOW: Payment → PMS Booking
   */
  async createBookingInPMS(data: {
    email: string;
    firstName: string;
    lastName: string;
    amount: number;
    hotelId: number;
    roomTypeId: number;
    dateFrom: string;
    dateTo: string;
  }) {
    try {
      // 1️ Ensure customer
      const customer = await this.ensureCustomer(
        data.email,
        data.firstName,
        data.lastName
      );

      // 2️ Create cart (reservation)
      const cartId = await this.createCart(
        customer.id,
        data.hotelId,
        data.dateFrom,
        data.dateTo,
        data.roomTypeId 
      );

      if (!cartId) {
        throw new Error("Cart creation failed — aborting booking");
      }

      // 3️ Create order
const orderXml = this.builder.buildObject({
  qloapps: {
    order: {
      id_address_delivery: 1,
      id_address_invoice: 1,
      id_cart: cartId,
      id_currency: 1,
      id_lang: 1,
      id_customer: customer.id,
      id_carrier: 1,
      module: 'ps_checkpayment',
      payment: 'Blockchain Verified (USDC)',
      total_paid: data.amount,
      total_paid_real: data.amount, 
      total_products: data.amount,
      total_products_wt: data.amount,
      conversion_rate: 1,
      secure_key: customer.secure_key,
      valid: 1,
      current_state: 2,
    },
  },
});

      const response = await axios.post(`${this.apiUrl}/orders`, orderXml, {
        params: { ws_key: this.apiKey },
        headers: { 'Content-Type': 'text/xml' },
      });

      return this.parseResponse(response.data, 'order');
    } catch (error: any) {
      console.error(" QloApps Sync Error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Ensure customer exists
   */
  private async ensureCustomer(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<Customer> {
    const url = `${this.apiUrl}/customers?ws_key=${this.apiKey}&filter[email]=[${email}]&display=full`;

    const check = await axios.get(url);
    const parsed = await parseStringPromise(check.data);

    const root = parsed.qloapps || parsed.prestashop;
    const existing = root?.customers?.[0]?.customer?.[0];

    if (existing) {
      return {
        id: existing.id[0],
        secure_key: existing.secure_key[0],
      };
    }

    // Create new customer
    const customerXml = this.builder.buildObject({
      qloapps: {
        customer: {
          firstname: firstName,
          lastname: lastName,
          email,
          passwd: 'password123',
          active: 1,
          id_shop: 1,
          id_shop_group: 1,
          phone: '0000000000',
          phone_mobile: '0000000000',
        },
      },
    });

    const res = await axios.post(`${this.apiUrl}/customers`, customerXml, {
      params: { ws_key: this.apiKey },
      headers: { 'Content-Type': 'text/xml' },
    });

    const parsedRes = await parseStringPromise(res.data);
    const resRoot = parsedRes.qloapps || parsedRes.prestashop;

    return {
      id: resRoot.customer[0].id[0],
      secure_key: resRoot.customer[0].secure_key[0],
    };
  }

  /**
   * Create cart (ROOM BOOKING)
   */
private async createCart(
  customerId: string,
  hotelId: number,
  from: string,
  to: string,
  roomTypeId: number
): Promise<string> {

  const cartObject = {
    qloapps: {
      cart: {
        id_customer: customerId,
        id_currency: 1,
        id_lang: 1,
        id_address_delivery: 1,
        id_address_invoice: 1,
        id_shop: 1,
        id_shop_group: 1,
        associations: {
          cart_bookings: {
            booking: {
              id_product: roomTypeId,
              id_product_attribute: 0,
              id_hotel: hotelId,
              date_from: from,
              date_to: to,
              quantity: 1
            }
          }
        }
      }
    }
  };

  const cartXml = this.builder.buildObject(cartObject);

  const res = await axios.post(`${this.apiUrl}/carts`, cartXml, {
    params: { ws_key: this.apiKey },
    headers: { 'Content-Type': 'text/xml' },
  });

  return this.parseResponse(res.data, 'cart');
}

  /**
   * Pull revenue + booking stats for a hotel from QloApps
   * dateFrom / dateTo format: YYYY-MM-DD
   */
  async getHotelStats(hotelId: number, dateFrom: string, dateTo: string) {
    try {
      // QloApps/PrestaShop orders API uses date_add (order creation date) for range
      // filtering. Format must be full datetime: "YYYY-MM-DD HH:MM:SS".
      const url = `${this.apiUrl}/orders?ws_key=${this.apiKey}&filter[date_add]=[${dateFrom} 00:00:00,${dateTo} 23:59:59]&display=full&output_format=JSON`;

      const res = await axios.get(url);
      const allOrders: any[] = res.data?.orders ?? [];

      // Filter to this specific hotel via cart_bookings association
      const orders = hotelId
        ? allOrders.filter((o: any) => {
            const bookings: any[] = o.associations?.cart_bookings?.booking ?? [];
            const arr = Array.isArray(bookings) ? bookings : [bookings];
            return arr.some((b: any) => Number(b.id_hotel) === hotelId);
          })
        : allOrders;

      const totalRevenue = orders.reduce(
        (sum: number, o: any) => sum + Number(o.total_paid ?? 0),
        0
      );

      const confirmedOrders = orders.filter(
        (o: any) => Number(o.current_state) === 2
      );

      return {
        hotelId,
        dateFrom,
        dateTo,
        totalOrders: orders.length,
        confirmedOrders: confirmedOrders.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      };
    } catch (error: any) {
      console.error(" QloApps getHotelStats error:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generic XML parser helper
   */
  private async parseResponse(xml: string, key: string): Promise<any> {
    const parsed = await parseStringPromise(xml);
    const root = parsed.qloapps || parsed.prestashop;

    if (!root || !root[key]) {
      throw new Error(`Invalid QloApps response: missing ${key}`);
    }

    return root[key][0].id ? root[key][0].id[0] : root[key][0];
  }
}

export const qloService = new QloService();