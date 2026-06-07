--
-- PostgreSQL database dump
--

\restrict PwHmvxxuiSYpV3FSjFVjWcOUqgilaYNtJU2XTetxp0tQYIyUjhAcnyK0FQu42bd

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg12+1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: digirealassets_db_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO digirealassets_db_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: digirealassets_db_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AssetStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."AssetStatus" AS ENUM (
    'UPCOMING',
    'ACTIVE',
    'SOLD_OUT',
    'CLOSED',
    'FUNDRAISING'
);


ALTER TYPE public."AssetStatus" OWNER TO digirealassets_db_user;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'PAID'
);


ALTER TYPE public."BookingStatus" OWNER TO digirealassets_db_user;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."DocumentType" AS ENUM (
    'PASSPORT',
    'DRIVERS_LICENSE',
    'NATIONAL_ID',
    'RESIDENCE_PERMIT'
);


ALTER TYPE public."DocumentType" OWNER TO digirealassets_db_user;

--
-- Name: ESGActionType; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."ESGActionType" AS ENUM (
    'ac_off',
    'towel_reuse',
    'no_cleaning',
    'water_saving',
    'recycling'
);


ALTER TYPE public."ESGActionType" OWNER TO digirealassets_db_user;

--
-- Name: ESGRewardStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."ESGRewardStatus" AS ENUM (
    'pending',
    'verified',
    'claimed'
);


ALTER TYPE public."ESGRewardStatus" OWNER TO digirealassets_db_user;

--
-- Name: InvestmentStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."InvestmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'CANCELLED',
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public."InvestmentStatus" OWNER TO digirealassets_db_user;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."KycStatus" AS ENUM (
    'NOT_STARTED',
    'PENDING',
    'IN_REVIEW',
    'APPROVED',
    'REJECTED',
    'RESUBMISSION_REQUIRED',
    'EXPIRED'
);


ALTER TYPE public."KycStatus" OWNER TO digirealassets_db_user;

--
-- Name: ProposalCategory; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."ProposalCategory" AS ENUM (
    'asset_acquisition',
    'fee_adjustment',
    'partnership',
    'platform_upgrade',
    'esg_initiative'
);


ALTER TYPE public."ProposalCategory" OWNER TO digirealassets_db_user;

--
-- Name: ProposalStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."ProposalStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'APPROVED',
    'REJECTED',
    'EXECUTED'
);


ALTER TYPE public."ProposalStatus" OWNER TO digirealassets_db_user;

--
-- Name: ProposalType; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."ProposalType" AS ENUM (
    'RENOVATION',
    'EXPANSION',
    'POLICY_CHANGE',
    'DIVIDEND_DISTRIBUTION',
    'OTHER'
);


ALTER TYPE public."ProposalType" OWNER TO digirealassets_db_user;

--
-- Name: StakingStatus; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."StakingStatus" AS ENUM (
    'ACTIVE',
    'UNSTAKED',
    'REWARDED',
    'CLOSED'
);


ALTER TYPE public."StakingStatus" OWNER TO digirealassets_db_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN',
    'PROPERTY_MANAGER',
    'COMPLIANCE_OFFICER',
    'FINANCE_MANAGER'
);


ALTER TYPE public."UserRole" OWNER TO digirealassets_db_user;

--
-- Name: VerificationLevel; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."VerificationLevel" AS ENUM (
    'BASIC',
    'INTERMEDIATE',
    'ADVANCED',
    'FULL'
);


ALTER TYPE public."VerificationLevel" OWNER TO digirealassets_db_user;

--
-- Name: VoteChoice; Type: TYPE; Schema: public; Owner: digirealassets_db_user
--

CREATE TYPE public."VoteChoice" AS ENUM (
    'FOR',
    'AGAINST',
    'ABSTAIN'
);


ALTER TYPE public."VoteChoice" OWNER TO digirealassets_db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: EsgReward; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public."EsgReward" (
    id text NOT NULL,
    user_email text NOT NULL,
    action_type public."ESGActionType" NOT NULL,
    reward_amount double precision NOT NULL,
    status public."ESGRewardStatus" DEFAULT 'pending'::public."ESGRewardStatus" NOT NULL,
    created_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."EsgReward" OWNER TO digirealassets_db_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO digirealassets_db_user;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.bookings (
    id text NOT NULL,
    user_id text NOT NULL,
    hotel_asset_id text NOT NULL,
    check_in_date timestamp(3) without time zone NOT NULL,
    check_out_date timestamp(3) without time zone NOT NULL,
    guests integer NOT NULL,
    room_type text NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    special_requests text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    booking_code text,
    discount_applied integer,
    payment_method text,
    payment_status text,
    payment_token text,
    platform_fee numeric(10,2),
    tx_hash text,
    wallet_address text,
    "qloOrderId" text
);


ALTER TABLE public.bookings OWNER TO digirealassets_db_user;

--
-- Name: hotel_assets; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.hotel_assets (
    id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    status public."AssetStatus" DEFAULT 'UPCOMING'::public."AssetStatus" NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by_id text NOT NULL,
    apy double precision,
    country text,
    created_by text,
    esg_score integer,
    image_url text,
    is_sample boolean,
    lease_end_date timestamp(3) without time zone,
    occupancy_rate double precision,
    revpar integer,
    room_count integer,
    star_rating integer,
    token_price integer,
    token_symbol text,
    tokens_sold integer,
    total_tokens integer,
    total_value integer,
    "tokenId" integer,
    token_address text,
    blockchain_id integer,
    wallet_address text
);


ALTER TABLE public.hotel_assets OWNER TO digirealassets_db_user;

--
-- Name: investments; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.investments (
    id text NOT NULL,
    user_id text NOT NULL,
    hotel_asset_id text NOT NULL,
    transaction_hash text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    status public."InvestmentStatus" DEFAULT 'PENDING'::public."InvestmentStatus" NOT NULL,
    amount numeric(10,2),
    created_by text,
    created_by_id text,
    earned_rewards numeric(10,2) NOT NULL,
    invested_amount numeric(10,2) NOT NULL,
    is_sample boolean DEFAULT false NOT NULL,
    pending_rewards numeric(10,2) NOT NULL,
    staked_amount numeric(10,2) NOT NULL,
    token_amount numeric(18,8) NOT NULL,
    "blockchainStatus" text DEFAULT 'PENDING'::text,
    blockchain_tx_hash text,
    deleted_at timestamp(3) without time zone,
    "walletAddress" text,
    "blockchainError" text,
    platform_fee numeric(10,2) DEFAULT 0
);


ALTER TABLE public.investments OWNER TO digirealassets_db_user;

--
-- Name: investor_yields; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.investor_yields (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    yield_distribution_id text NOT NULL,
    user_id text NOT NULL,
    investment_id text,
    amount numeric(18,8) NOT NULL,
    status character varying(50) DEFAULT 'PENDING'::character varying,
    tx_hash text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.investor_yields OWNER TO digirealassets_db_user;

--
-- Name: kyc; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.kyc (
    id text NOT NULL,
    user_id text NOT NULL,
    full_name text NOT NULL,
    date_of_birth timestamp(3) without time zone NOT NULL,
    nationality text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    rejection_reason text,
    submitted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_at timestamp(3) without time zone,
    reviewed_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    address text NOT NULL,
    document_number text NOT NULL,
    document_type text NOT NULL,
    status public."KycStatus" DEFAULT 'PENDING'::public."KycStatus" NOT NULL,
    "approvedAt" timestamp(3) without time zone,
    "blockchainTx" text,
    "blockchainVerifier" text,
    "documentHash" text,
    "expiresAt" timestamp(3) without time zone,
    address_proof text,
    document_back text,
    document_front text,
    selfie_image text
);


ALTER TABLE public.kyc OWNER TO digirealassets_db_user;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.payment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "bookingId" text NOT NULL,
    amount double precision NOT NULL,
    currency text NOT NULL,
    status text NOT NULL,
    "txHash" text,
    signature text,
    receiver text,
    "expiresAt" timestamp without time zone,
    message text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payment OWNER TO digirealassets_db_user;

--
-- Name: proposals; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.proposals (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public."ProposalType" NOT NULL,
    proposer_id text NOT NULL,
    hotel_asset_id text,
    status public."ProposalStatus" DEFAULT 'DRAFT'::public."ProposalStatus" NOT NULL,
    voting_start_date timestamp(3) without time zone,
    voting_end_date timestamp(3) without time zone,
    votes_for integer DEFAULT 0 NOT NULL,
    votes_against integer DEFAULT 0 NOT NULL,
    votes_abstain integer DEFAULT 0 NOT NULL,
    quorum_required integer NOT NULL,
    approval_threshold integer NOT NULL,
    execution_details text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by_id text NOT NULL,
    category public."ProposalCategory"
);


ALTER TABLE public.proposals OWNER TO digirealassets_db_user;

--
-- Name: settlements; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.settlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id text NOT NULL,
    hotel_asset_id text NOT NULL,
    hotel_wallet text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL,
    status text NOT NULL,
    tx_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settlements OWNER TO digirealassets_db_user;

--
-- Name: staking; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.staking (
    id text NOT NULL,
    user_id text NOT NULL,
    staked_amount double precision NOT NULL,
    lock_period_days integer NOT NULL,
    stake_start_date timestamp(3) without time zone NOT NULL,
    stake_end_date timestamp(3) without time zone NOT NULL,
    apy_rate double precision NOT NULL,
    earned_rewards double precision DEFAULT 0 NOT NULL,
    claimed_rewards double precision DEFAULT 0 NOT NULL,
    voting_power_multiplier double precision DEFAULT 1 NOT NULL,
    status public."StakingStatus" DEFAULT 'ACTIVE'::public."StakingStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by_id text NOT NULL,
    is_sample boolean DEFAULT false NOT NULL
);


ALTER TABLE public.staking OWNER TO digirealassets_db_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    is_email_verified boolean DEFAULT false NOT NULL,
    email_verified_at timestamp(3) without time zone,
    kyc_status public."KycStatus" DEFAULT 'NOT_STARTED'::public."KycStatus" NOT NULL,
    kyc_submitted_at timestamp(3) without time zone,
    kyc_approved_at timestamp(3) without time zone,
    wallet_address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    kyc_expires_at timestamp(3) without time zone,
    verification_level public."VerificationLevel",
    "verificationExpires" timestamp(3) without time zone,
    "verificationToken" text,
    "resetPasswordExpires" timestamp(3) without time zone,
    "resetPasswordToken" text,
    kyc_blockchain_synced boolean DEFAULT false NOT NULL,
    kyc_blockchain_tx_hash text,
    kyc_last_verified timestamp(3) without time zone,
    kyc_sync_attempts integer DEFAULT 0 NOT NULL,
    kyc_sync_error text,
    "kycDocumentHash" text
);


ALTER TABLE public.users OWNER TO digirealassets_db_user;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.votes (
    id text NOT NULL,
    proposal_id text NOT NULL,
    user_id text NOT NULL,
    choice public."VoteChoice" NOT NULL,
    voting_power integer NOT NULL,
    comment text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.votes OWNER TO digirealassets_db_user;

--
-- Name: yield_distributions; Type: TABLE; Schema: public; Owner: digirealassets_db_user
--

CREATE TABLE public.yield_distributions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    booking_id text NOT NULL,
    hotel_asset_id text NOT NULL,
    total_amount numeric(18,8) NOT NULL,
    distribution_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.yield_distributions OWNER TO digirealassets_db_user;

--
-- Data for Name: EsgReward; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public."EsgReward" (id, user_email, action_type, reward_amount, status, created_date, updated_at) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1e6e84de-ef3e-48cf-9f23-cd766619edfb	2b1542eb16b59c64cf3f115ab64a88b581e3fee16e3111ce436905f04017fa8a	2026-03-05 09:40:33.558359+00	20260215124033_change_token_amount_to_decimal	\N	\N	2026-03-05 09:40:33.519774+00	1
0ffd3983-dfd1-4f59-9f0a-be19fd4301c1	9212d341f28526060b713802f844d0eaa45c09fbe2cc6627ac53be42485ad315	2026-03-05 09:40:33.103514+00	20251217073933_init	\N	\N	2026-03-05 09:40:32.940764+00	1
c3c580cd-c829-4360-beda-c19e8dee2c41	785d44ee0d90975dc7ae4476a08cf9d23c8ee6cd5f7c0a5acbadb7f9d24381e5	2026-03-05 09:40:33.397534+00	20260105073639_email_verification	\N	\N	2026-03-05 09:40:33.384352+00	1
f3741d45-9a6c-4d17-9768-62be21eb73e8	861e8d9dcefcd32d021a070634747583b31bd3e5dc1ad577755fb898a84b8515	2026-03-05 09:40:33.184422+00	20251222151810_add_kyc_blockchain_integration	\N	\N	2026-03-05 09:40:33.106415+00	1
d99301c0-339b-4c8f-b048-7a03cfaac658	9b156e0d5928dc9d7dd65816879265eacb51865eb686d02ad6bcefc564f10494	2026-03-05 09:40:33.201908+00	20251224040157_fix_kyc_migration	\N	\N	2026-03-05 09:40:33.18759+00	1
a388c8d0-4337-41f8-8c3c-71c5065ed090	5b9b6d148410cc10446eda86374d257095542eec17f3ae6827b004d1aec37379	2026-03-05 09:40:33.245927+00	20251224162307_remove_old_kyc_fields	\N	\N	2026-03-05 09:40:33.205027+00	1
a4c1903c-04a1-4956-ba69-dfb90daf12e0	21b8285ac21921a7bd5de3de458f74f9111565787d0f9cb72b92cab59dda6135	2026-03-05 09:40:33.412428+00	20260105084817_email_verification	\N	\N	2026-03-05 09:40:33.401364+00	1
bd577d15-c000-47f1-bdc0-cc1c8ca7031e	69b6cda7ab46257f11d3c264cd4e6ad1efea78f2743ca029ac8a70ce2e4acac7	2026-03-05 09:40:33.257912+00	20251225030912_add_expired_kyc_status	\N	\N	2026-03-05 09:40:33.248777+00	1
87481db2-89f6-4e30-98b4-ca394f25dd59	c23bb85be44ac558d4caea38de4db436325e11f75b5b2fbb531de244c2a307a9	2026-03-05 09:40:33.271242+00	20251225031940_add_kyc_status_field	\N	\N	2026-03-05 09:40:33.260617+00	1
02791c3a-d09c-4d82-9f8e-1c1300e40175	30e322d57b487bfdfb9a9138d9704ae4c3dbb206c9ac1cbf1623ae8c0c61f93c	2026-03-05 09:40:33.284989+00	20251225054715_add_blockchain_fields	\N	\N	2026-03-05 09:40:33.274071+00	1
db09e7d5-52d5-4bca-8cc8-78776b1ee92f	b4f29ac49e4becde2f7a0452a0ce5b07d938896f058677e2eef907db16f5aefc	2026-03-05 09:40:33.425433+00	20260110160056_add_booking_fields	\N	\N	2026-03-05 09:40:33.415426+00	1
7b7471d2-1d10-4907-96ef-274a7e2af4d1	a9d822bbcf3db921013f985027c9fd43669a0008c2c8dcf3b86cc18a9aed8154	2026-03-05 09:40:33.297817+00	20251227100209_add_kyc_file_fields	\N	\N	2026-03-05 09:40:33.288301+00	1
df45d676-e3e6-427f-87c9-6ad3e887a3bd	2e6a746725ab43b872eb8bdf594717f3611b8614b427f6cad8037a27dcc61ef5	2026-03-05 09:40:33.311252+00	20260102125148_add_all_missing_columns	\N	\N	2026-03-05 09:40:33.301112+00	1
163fc26e-15f5-46e7-a65d-fbeae62e98d7	a9fa65d590c3e095547b57cc9ae3c565b8f8a90a88c3af7b477277526f5ea914	2026-03-05 09:40:33.574737+00	20260221221442_add_kyc_blockchain_sync_fields	\N	\N	2026-03-05 09:40:33.561564+00	1
2d7bf54c-ab9f-4e67-a487-ce83fab678b8	6b33d8e56f5dab6f2fdf52b41681264624ba257b183f2b34d9e834a8b8e20197	2026-03-05 09:40:33.325032+00	20260102165537_add_csv_fields_to_investments	\N	\N	2026-03-05 09:40:33.314523+00	1
d86e2d6c-5ff4-4298-a616-bfa4e9dcaef5	8b9c9131b8e8c367a0b5661d03eac2524f05d08b42186e7f9546e948ef282897	2026-03-05 09:40:33.446153+00	20260112114817_add_esg_enums	\N	\N	2026-03-05 09:40:33.428086+00	1
80a3df0c-1ca0-4e40-bd07-3ee2e869ea59	a11659d46283929170ba4541eb524eef0b5a4c9217455019ab424e8aaa975125	2026-03-05 09:40:33.336826+00	20260102171631_add_csv_fields_to_investments	\N	\N	2026-03-05 09:40:33.327946+00	1
f0adc1dc-7d02-436b-844a-22506d451cfc	935cb31720e4a957264a5dda50d7e8c12546257b57ddf56e3c2e48e5a6f784ff	2026-03-05 09:40:33.350315+00	20260102175654_add_csv_fields_to_investments	\N	\N	2026-03-05 09:40:33.34023+00	1
ce627340-30ec-4dbb-9e7a-ea05fb5f6955	d410d82595b7c73bd1e6cea887ac45118892d71ae3fd6c35c0b1276524a5f8cd	2026-03-05 09:40:33.381274+00	20260102220402_staking	\N	\N	2026-03-05 09:40:33.353242+00	1
0b9a25f3-49af-4aee-a2f8-c5fe44f3fe43	8a56a8fb19ed8d2c5146fba69b6b5f61b64b7a8056def0cc960b123669eda056	2026-03-05 09:40:33.469366+00	20260112123521_add_esg_enums	\N	\N	2026-03-05 09:40:33.449204+00	1
ffd1ed4b-4727-46f5-ac44-64f9ff44a2fb	540dbd4bded240b85792b33a08556e4eb9d7004221e1c2b7343ffd657dcf7979	2026-03-05 09:40:33.481093+00	20260113062925_add_proposal_category	\N	\N	2026-03-05 09:40:33.472125+00	1
49403b5f-e908-4140-a10c-4a32f0f8bfc0	3c17c35ff57b300aa18cd350234a29fcea6919ee0f66d34fa382a291ae00cede	2026-03-05 09:40:33.591806+00	20260221224353_add_kyc_document_hash	\N	\N	2026-03-05 09:40:33.578519+00	1
393bbf8c-b008-4c25-85b2-b69b0e0aa15a	ddf811d0ff560c3c2c8476040bc6ce2e67ea957f071fb24d57ed187465247f00	2026-03-05 09:40:33.499814+00	20260212141131_add_token_id	\N	\N	2026-03-05 09:40:33.483533+00	1
4d8cb461-6729-491b-89b0-bff8bbd9fef5	39d71b54696896930bbd2889e91b65d73c88f68e3b4a060422c032de4443336d	2026-03-05 09:40:33.515616+00	20260212145758_add_token_id	\N	\N	2026-03-05 09:40:33.502636+00	1
82a119da-0d78-400e-aee7-d789f423ecb1	56553136af70c9eb53ab57ec36741b8e9862d1b40872f41972fb46f0387dcd2f	2026-03-05 09:40:33.610488+00	20260302034932_add_blockchain_id	\N	\N	2026-03-05 09:40:33.595159+00	1
b530ff71-4a74-4350-a736-a9ac47c9f0a3	025590029bcf293c03c6dc28f438b2b410c1430295c0ab3c3a98812cd1ec57a2	2026-03-05 13:08:56.762908+00	20260305130856_add_fundraising_to_assetstatus	\N	\N	2026-03-05 13:08:56.758333+00	1
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.bookings (id, user_id, hotel_asset_id, check_in_date, check_out_date, guests, room_type, total_price, status, special_requests, created_at, updated_at, booking_code, discount_applied, payment_method, payment_status, payment_token, platform_fee, tx_hash, wallet_address, "qloOrderId") FROM stdin;
d56440e6-56fb-4449-9c7e-152ca9964baf	c89f74f2-b245-4ab3-a201-ca0b17d9890d	d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce	2026-05-05 00:00:00	2026-05-06 00:00:00	2	deluxe	5.00	PAID	\N	2026-05-04 20:52:05.448	2026-05-04 20:52:27.117	DRA-BKG-2026-RYTZ4	\N	usdc	SUCCESS	USDC	\N	0xaa88aa55102686c7883c116eb14693920461be03200d1585da430eb30f7f71bf	0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f	\N
85a53f92-bcb3-4120-9499-25e796471eaa	c89f74f2-b245-4ab3-a201-ca0b17d9890d	12a04eed-c00f-4374-9261-2842ffcee58d	2026-05-05 00:00:00	2026-05-06 00:00:00	2	standard	2.50	PAID	\N	2026-05-04 21:10:34.983	2026-05-04 21:10:53.031	DRA-BKG-2026-59DSU	\N	usdc	SUCCESS	USDC	\N	0xc6fda38f8330c15ae8fff17c592ec8495624554c582275d44d514deffd290f39	0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f	1
c568a103-28b5-4812-96f9-491ec3a3b4af	c89f74f2-b245-4ab3-a201-ca0b17d9890d	25c38d85-6b08-48f3-8d67-3795a32a9fbf	2026-05-19 00:00:00	2026-05-20 00:00:00	2	standard	2.50	PAID	\N	2026-05-19 05:20:52.679	2026-05-19 05:21:08.764	DRA-BKG-2026-QDKAY	\N	usdc	SUCCESS	USDC	\N	0xbe6e004fc63245f75d6580368a7efbcec633d6a3c0214d3d5dae46237b7ffaee	0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f	2
747f252e-073e-45b9-bf5a-9a245b265e69	c89f74f2-b245-4ab3-a201-ca0b17d9890d	4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722	2026-05-19 00:00:00	2026-05-20 00:00:00	2	deluxe	5.00	PAID	\N	2026-05-19 06:43:58.365	2026-05-19 06:44:17.601	DRA-BKG-2026-69ATJ	\N	usdc	SUCCESS	USDC	\N	0x261382cd4586d2e4812029fe8028a3c463489a78381b673a09ed51a5f788651a	0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f	3
\.


--
-- Data for Name: hotel_assets; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.hotel_assets (id, name, location, status, description, created_at, updated_at, created_by_id, apy, country, created_by, esg_score, image_url, is_sample, lease_end_date, occupancy_rate, revpar, room_count, star_rating, token_price, token_symbol, tokens_sold, total_tokens, total_value, "tokenId", token_address, blockchain_id, wallet_address) FROM stdin;
d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce	Waldorf Astoria Maldives	Maldives	FUNDRAISING	\N	2026-03-05 13:49:52.54	2026-03-07 13:31:44.088	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://www.sbid.org/wp-content/uploads//2020/02/Hotel-design-by-Godwin-Austen-Johnson-2019-4.jpg	f	\N	\N	\N	\N	\N	2000	\N	0	1000000	\N	\N	0xd53fae115cc316faeb08193ffa2665b529022818	6	0x155b77319260eB92DA6E1febeB1db3C48360D0fb
25c38d85-6b08-48f3-8d67-3795a32a9fbf	Marina Bay Sands	Singapore, Singapore	FUNDRAISING	\N	2026-03-05 13:21:20.408	2026-05-19 05:15:18.196	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4	f	\N	\N	\N	\N	\N	20	\N	0	1000000	\N	\N	0xc5a364742708984c69447a7a145e05127f865291	2	0x2CC88C9C3FeCc3d1F1EBb92DA9A3da3E2Ab79B77
4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722	My Hotel Name	Kathmandu, Nepal	FUNDRAISING	\N	2026-03-05 13:21:19.801	2026-05-19 06:40:00.982	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800	f	\N	\N	\N	\N	\N	100000	\N	0	1000000	\N	\N	0xd1d60d87688b9a08549e90751a647b3bd6babb57	3	0x09b5657527A5247807ff357814440355f485854A
09c1fdb9-c592-4240-bcec-1c7a729074a7	Ritz Carlton Bali	Bali, Indonesia	FUNDRAISING	\N	2026-03-05 13:21:20.752	2026-03-05 13:21:20.752	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1582719508461-905c673771fd	f	\N	\N	\N	\N	\N	20	\N	\N	1000000	\N	\N	0xe1c7e8b2a4edbfbdfc8e71f8bb89c8844f2a9afa	4	0xf171bEB36ca0B30E3F47B6e5665df4968b4FDe60
e009ef84-23bc-473e-b5d8-6c9a7498c784	Grand Plaza Hotel - Branch 2	Jakarta, Indonesia	FUNDRAISING	\N	2026-03-05 13:49:52.373	2026-03-05 13:49:52.373	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800	f	\N	\N	\N	\N	\N	20	\N	\N	1000000	\N	\N	0x8a8b0f8659b243cd00ea5c7dfd0838597cab6556	1	0xAb62CBB6d80734e63c8a3aA619298D4C617ced2D
12a04eed-c00f-4374-9261-2842ffcee58d	Mountain View Lodge	Bhutan	FUNDRAISING	\N	2026-03-05 13:49:52.953	2026-03-16 06:37:47.139	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800	f	\N	\N	\N	\N	\N	20	\N	0	1000000	\N	\N	0xa7eb173dd8d5884c0f7cf59ce5fd5c3addaf407b	5	0xd08B11B09947507C873fe2b1dE1fe685708e4E7B
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.investments (id, user_id, hotel_asset_id, transaction_hash, created_at, updated_at, status, amount, created_by, created_by_id, earned_rewards, invested_amount, is_sample, pending_rewards, staked_amount, token_amount, "blockchainStatus", blockchain_tx_hash, deleted_at, "walletAddress", "blockchainError", platform_fee) FROM stdin;
77262d30-7a5c-4f2b-aeb0-0993f8737b04	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce	\N	2026-03-07 06:39:26.829	2026-05-04 20:52:27.123	ACTIVE	1.00	\N	\N	0.00	1.00	f	0.25	0.00	0.00050000	MINTED	0x6f1c4dd8921b7cc7da7cd3e9a16a2d101b55ca14e3e2d512f3f1a8c082637425	\N	\N	\N	0.00
35fd18cb-5e80-4fb5-890a-57cfe4ae45a0	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce	\N	2026-03-07 13:31:44.087	2026-05-04 20:52:27.125	ACTIVE	1.00	\N	\N	0.00	1.00	f	0.25	0.00	0.00050000	MINTED	0x82cf65c40d503273a5fe2e8718f746881b74d68164491003f005fc94b6ff524f	\N	\N	\N	0.00
e5294f83-b9c1-44a3-bc9b-53af0dc1ee59	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	12a04eed-c00f-4374-9261-2842ffcee58d	\N	2026-03-06 19:28:25.185	2026-05-04 21:10:50.51	ACTIVE	2.00	\N	\N	0.00	2.00	f	0.08	0.00	0.10000000	MINTED	0xc74ba0ab59bb88f034dd2c6f2f8c173f7cb81343275647ce3d408e40afb87dad	\N	\N	\N	0.00
c502f0eb-d9e9-477f-afda-c09931769b21	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	12a04eed-c00f-4374-9261-2842ffcee58d	\N	2026-03-08 03:56:15.859	2026-05-04 21:10:50.52	ACTIVE	2.00	\N	\N	0.00	2.00	f	0.08	0.00	0.10000000	MINTED	0x6b07461de14842b9c644b1c7bc6272d46b14825122994d3c43fea1073c247469	\N	\N	\N	0.00
cbdab0a2-ab6a-458b-81d0-48168f860792	c89f74f2-b245-4ab3-a201-ca0b17d9890d	12a04eed-c00f-4374-9261-2842ffcee58d	\N	2026-03-16 06:37:47.138	2026-05-04 21:10:50.522	ACTIVE	2.00	\N	\N	0.00	1.96	f	0.08	0.00	0.09800000	MINTED	0x34c4cd5c3fcfb6813314aa44a2f5a3f687416eca08a626adf6ad3aadaffffb88	\N	\N	\N	0.04
aa2e840b-a4d3-44d6-b6ad-b9933c31e973	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	25c38d85-6b08-48f3-8d67-3795a32a9fbf	\N	2026-03-08 03:58:52.382	2026-05-19 05:21:05.319	ACTIVE	2.00	\N	\N	0.00	2.00	f	0.13	0.00	0.10000000	MINTED	0x7437f97ef9eafcde8d715ec658829e40cf7c3fc9e60fd6c2f1410ca607ef68f6	\N	\N	\N	0.00
a496bd47-9c05-4d27-a921-8ae8415a7a40	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	25c38d85-6b08-48f3-8d67-3795a32a9fbf	\N	2026-05-19 02:01:30.281	2026-05-19 05:21:05.34	ACTIVE	1.00	\N	\N	0.00	0.98	f	0.06	0.00	0.04900000	MINTED	0x32ec7e9b45494cb43960b5fc964d5815bbb985c5c1bc6b1c6f399ea75c5da962	\N	\N	\N	0.02
5b26e875-81e9-44e2-8303-8251c1d2031e	c89f74f2-b245-4ab3-a201-ca0b17d9890d	25c38d85-6b08-48f3-8d67-3795a32a9fbf	\N	2026-05-19 05:15:18.193	2026-05-19 05:21:05.359	ACTIVE	1.00	\N	\N	0.00	0.98	f	0.06	0.00	0.04900000	MINTED	0x4a8272161715894a8ebedb796a59625b5e98a6b9ed38d9ae2bf904354b6cc1f8	\N	\N	\N	0.02
1aa09b33-dd5d-41f6-9a09-754e4ba16081	c89f74f2-b245-4ab3-a201-ca0b17d9890d	4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722	\N	2026-05-19 06:40:00.981	2026-05-19 06:44:14.477	ACTIVE	2.00	\N	\N	0.00	1.96	f	0.50	0.00	0.00002000	MINTED	0x8c599ed7959ea0703b0f4d88612bd0ffbc384ee4387bd7db05e9ef076c8bf39b	\N	\N	\N	0.04
\.


--
-- Data for Name: investor_yields; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.investor_yields (id, yield_distribution_id, user_id, investment_id, amount, status, tx_hash, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: kyc; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.kyc (id, user_id, full_name, date_of_birth, nationality, city, state, postal_code, country, rejection_reason, submitted_at, reviewed_at, reviewed_by, created_at, updated_at, address, document_number, document_type, status, "approvedAt", "blockchainTx", "blockchainVerifier", "documentHash", "expiresAt", address_proof, document_back, document_front, selfie_image) FROM stdin;
5ad0feba-1487-4c53-a9a5-bc576d596a85	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	ADONI KADJO MATHIAS	2026-03-06 00:00:00	Cote d'Ivoire	Abidjan	lagune	BP06ABJ	Ivory Coast	\N	2026-03-05 18:17:30.413	2026-03-05 18:18:29.751	\N	2026-03-05 18:17:30.413	2026-03-07 18:52:49.456	ABidjanBP06	24AV52742	Passport	APPROVED	2026-03-05 18:18:30.597	already-approved	\N	\N	\N	addressProof-1772734650395-653537969.pdf	documentBack-1772734650379-500486217.jpg	documentFront-1772734650359-634482406.jpg	selfieImage-1772734650386-951381066.jpg
415ad96b-825e-4a31-a61b-bf952218ca6a	8bfa87c9-99df-47d5-9792-e087159d2f06	Yuan Gao	2026-03-16 00:00:00	China	Shenzhen	Guangdong	6789SZ	China	\N	2026-03-16 05:45:53.642	2026-03-16 05:47:38.236	\N	2026-03-16 05:45:53.642	2026-03-16 05:47:42.822	ShenZhen city098TY	24AV	Driver Licences	APPROVED	2026-03-16 05:47:42.821	\N	\N	0xeead5315226ba6bdc2d3dc29d92aea534d94bd23eb290267a6ecc8bbbcceb3f6	\N	addressProof-1773639953512-193521350.pdf	documentBack-1773639953479-275367615.jpg	documentFront-1773639953329-455805692.jpg	selfieImage-1773639953496-785300730.jpg
8d09f485-7300-47db-9708-baede962f876	1cc582e2-a8e2-4f68-9988-f7808d461bc3	dENGDI	1988-03-03 00:00:00	Paris	shenzhen	chaina	03939	paris	\N	2026-03-17 13:09:29.913	2026-03-17 13:10:47.61	\N	2026-03-17 13:09:29.913	2026-03-17 13:10:52.196	hongkong	j3322322	passport	APPROVED	2026-03-17 13:10:52.195	\N	\N	0x81545bb235e52972afb40c6f54c98f18398bc60cfad45b0165f49a06a524c257	\N	\N	documentBack-1773752969696-782247410.jpg	documentFront-1773752969571-843559102.jpg	selfieImage-1773752969726-859853240.jpg
1a39c20a-8881-49ea-bbbc-918dad29fd05	c89f74f2-b245-4ab3-a201-ca0b17d9890d	YUAN XU	2026-03-16 00:00:00	China	Shenzhen	Guangdong	6789SZ	China	\N	2026-03-16 06:33:50.644	2026-03-16 06:34:59.076	\N	2026-03-16 06:33:50.644	2026-05-04 17:39:44.241	ShenZhen city098TY	24AV52742	Driver License	APPROVED	2026-03-16 06:35:03.761	already-approved	\N	0xeead5315226ba6bdc2d3dc29d92aea534d94bd23eb290267a6ecc8bbbcceb3f6	\N	addressProof-1773642830519-912135556.pdf	documentBack-1773642830478-734538256.jpg	documentFront-1773642830304-944487922.jpg	selfieImage-1773642830504-959427681.jpg
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.payment (id, "bookingId", amount, currency, status, "txHash", signature, receiver, "expiresAt", message, "createdAt") FROM stdin;
ab38d907-b0b6-4b79-ada5-d95ff0ee059b	d56440e6-56fb-4449-9c7e-152ca9964baf	5	USDC	CONFIRMED	0xaa88aa55102686c7883c116eb14693920461be03200d1585da430eb30f7f71bf	\N	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-05-04 21:02:05.775	\N	2026-05-04 20:52:05.776
f32293d6-4c48-4fef-9266-259a0ea553ba	85a53f92-bcb3-4120-9499-25e796471eaa	2.5	USDC	CONFIRMED	0xc6fda38f8330c15ae8fff17c592ec8495624554c582275d44d514deffd290f39	\N	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-05-04 21:20:35.292	\N	2026-05-04 21:10:35.293
d5b14a7d-e8f6-4433-8d61-a2b58192ff15	c568a103-28b5-4812-96f9-491ec3a3b4af	2.5	USDC	CONFIRMED	0xbe6e004fc63245f75d6580368a7efbcec633d6a3c0214d3d5dae46237b7ffaee	\N	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-05-19 05:30:53.196	\N	2026-05-19 05:20:53.198
dc31a6dc-9104-4eb5-a108-4b5d3ba6ab81	747f252e-073e-45b9-bf5a-9a245b265e69	5	USDC	CONFIRMED	0x261382cd4586d2e4812029fe8028a3c463489a78381b673a09ed51a5f788651a	\N	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-05-19 06:53:58.638	\N	2026-05-19 06:43:58.639
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.proposals (id, title, description, type, proposer_id, hotel_asset_id, status, voting_start_date, voting_end_date, votes_for, votes_against, votes_abstain, quorum_required, approval_threshold, execution_details, created_at, updated_at, created_by_id, category) FROM stdin;
\.


--
-- Data for Name: settlements; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.settlements (id, booking_id, hotel_asset_id, hotel_wallet, amount, currency, status, tx_hash, created_at) FROM stdin;
3fcf757a-02e6-42fc-a7dd-bdfb9f498994	c568a103-28b5-4812-96f9-491ec3a3b4af	25c38d85-6b08-48f3-8d67-3795a32a9fbf	0x2CC88C9C3FeCc3d1F1EBb92DA9A3da3E2Ab79B77	2.50	USDC	COMPLETED	0x05c47f02a7dd293947886a5d45cb3fb6588938e32c1baf720e6123ca2e6d4807	2026-05-19 05:21:08.779
fc6f97a3-6dfe-429e-a353-d6d22d22d72d	747f252e-073e-45b9-bf5a-9a245b265e69	4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722	0x09b5657527A5247807ff357814440355f485854A	5.00	USDC	PENDING	\N	2026-05-19 06:44:17.605
\.


--
-- Data for Name: staking; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.staking (id, user_id, staked_amount, lock_period_days, stake_start_date, stake_end_date, apy_rate, earned_rewards, claimed_rewards, voting_power_multiplier, status, created_at, updated_at, created_by_id, is_sample) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.users (id, email, password, first_name, last_name, phone, role, is_email_verified, email_verified_at, kyc_status, kyc_submitted_at, kyc_approved_at, wallet_address, created_at, updated_at, kyc_expires_at, verification_level, "verificationExpires", "verificationToken", "resetPasswordExpires", "resetPasswordToken", kyc_blockchain_synced, kyc_blockchain_tx_hash, kyc_last_verified, kyc_sync_attempts, kyc_sync_error, "kycDocumentHash") FROM stdin;
85b6e6b2-b96e-4a40-8d2a-95fa16d32159	adonikadjo@hotmail.com	$2b$10$2ggPOP5Tr9WD.QGdVq/WY.nDB1nRGdU7/CmZhLzpvhL6qfd42.dBC	adoni	mathias	\N	USER	t	2026-03-05 12:39:21.964	APPROVED	2026-03-05 18:17:30.424	2026-03-05 18:18:30.61	0x09b5657527A5247807ff357814440355f485854A	2026-03-05 12:38:12.669	2026-03-07 18:52:49.399	\N	\N	\N	\N	\N	\N	f	\N	\N	0	\N	\N
895506a7-e5c6-4e19-b329-97c24f918fa7	dra@digirealassets.io	$2b$10$vnAoOD9ix4goXrJgwe5QBOAYgDpslgSR5aoPEJ/qj1hIzn2N9ERfq	Dean	Dean	\N	USER	t	2026-03-08 05:19:23.039	PENDING	\N	\N	\N	2026-03-08 05:19:01.536	2026-03-08 05:19:23.041	\N	\N	\N	\N	\N	\N	f	\N	\N	0	\N	\N
8bfa87c9-99df-47d5-9792-e087159d2f06	kadjomathias1994@gmail.com	$2b$10$YxGeNWgQEPvP/YEBgd.fse6CPWizjrdyRRyHC4lSv3d1J1uUYF72i	Yuan	Gao	\N	USER	t	2026-03-16 05:40:52.661	APPROVED	2026-03-16 05:45:53.646	2026-03-16 05:47:42.897	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-03-16 05:40:05.646	2026-03-16 05:47:42.898	\N	\N	\N	\N	\N	\N	f	\N	\N	0	\N	\N
1cc582e2-a8e2-4f68-9988-f7808d461bc3	18123635200@163.com	$2b$10$YySsKMpsFfjuXLAB0d464OFC1DYmbFU5U5CX0pUCUAT6Ph7NWglke	Dean	Deng	\N	USER	t	2026-03-07 11:06:14.591	APPROVED	2026-03-17 13:09:29.917	2026-03-17 13:10:52.207	0x5678c8E96371453b857CC7EbA8BBE7665708Fe02	2026-03-07 11:05:43.194	2026-03-17 13:10:52.208	\N	\N	\N	\N	\N	\N	f	\N	\N	0	\N	\N
c89f74f2-b245-4ab3-a201-ca0b17d9890d	adonimathias53@gmail.com	$2b$10$pK0/3/jgCU8B7iuJJN..Xud6lvs5XKb8uLy6FqjcixBFsEdcc6g7q	YUAN	XU	\N	USER	t	2026-03-16 06:28:37.694	APPROVED	2026-03-16 06:33:50.647	2026-03-16 06:35:03.764	0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f	2026-03-16 06:28:14.121	2026-05-04 17:39:44.182	\N	\N	\N	\N	\N	\N	f	\N	\N	0	\N	\N
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.votes (id, proposal_id, user_id, choice, voting_power, comment, created_at) FROM stdin;
\.


--
-- Data for Name: yield_distributions; Type: TABLE DATA; Schema: public; Owner: digirealassets_db_user
--

COPY public.yield_distributions (id, booking_id, hotel_asset_id, total_amount, distribution_date, created_at, updated_at) FROM stdin;
\.


--
-- Name: EsgReward EsgReward_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public."EsgReward"
    ADD CONSTRAINT "EsgReward_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: hotel_assets hotel_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT hotel_assets_pkey PRIMARY KEY (id);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: investor_yields investor_yields_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT investor_yields_pkey PRIMARY KEY (id);


--
-- Name: kyc kyc_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: settlements settlements_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT settlements_pkey PRIMARY KEY (id);


--
-- Name: staking staking_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_pkey PRIMARY KEY (id);


--
-- Name: hotel_assets unique_token_address; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT unique_token_address UNIQUE (token_address);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: yield_distributions yield_distributions_pkey; Type: CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT yield_distributions_pkey PRIMARY KEY (id);


--
-- Name: bookings_booking_code_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX bookings_booking_code_key ON public.bookings USING btree (booking_code);


--
-- Name: bookings_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX bookings_hotel_asset_id_idx ON public.bookings USING btree (hotel_asset_id);


--
-- Name: bookings_qloOrderId_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX "bookings_qloOrderId_key" ON public.bookings USING btree ("qloOrderId");


--
-- Name: bookings_status_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX bookings_status_idx ON public.bookings USING btree (status);


--
-- Name: bookings_user_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX bookings_user_id_idx ON public.bookings USING btree (user_id);


--
-- Name: hotel_assets_blockchain_id_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX hotel_assets_blockchain_id_key ON public.hotel_assets USING btree (blockchain_id);


--
-- Name: hotel_assets_tokenId_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX "hotel_assets_tokenId_key" ON public.hotel_assets USING btree ("tokenId");


--
-- Name: investments_blockchainStatus_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX "investments_blockchainStatus_idx" ON public.investments USING btree ("blockchainStatus");


--
-- Name: investments_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX investments_hotel_asset_id_idx ON public.investments USING btree (hotel_asset_id);


--
-- Name: investments_status_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX investments_status_idx ON public.investments USING btree (status);


--
-- Name: investments_transaction_hash_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX investments_transaction_hash_idx ON public.investments USING btree (transaction_hash);


--
-- Name: investments_user_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX investments_user_id_idx ON public.investments USING btree (user_id);


--
-- Name: kyc_reviewed_by_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX kyc_reviewed_by_idx ON public.kyc USING btree (reviewed_by);


--
-- Name: kyc_user_id_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX kyc_user_id_key ON public.kyc USING btree (user_id);


--
-- Name: proposals_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX proposals_hotel_asset_id_idx ON public.proposals USING btree (hotel_asset_id);


--
-- Name: proposals_proposer_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX proposals_proposer_id_idx ON public.proposals USING btree (proposer_id);


--
-- Name: proposals_status_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX proposals_status_idx ON public.proposals USING btree (status);


--
-- Name: staking_status_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX staking_status_idx ON public.staking USING btree (status);


--
-- Name: staking_user_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX staking_user_id_idx ON public.staking USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_kyc_blockchain_synced_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX users_kyc_blockchain_synced_idx ON public.users USING btree (kyc_blockchain_synced);


--
-- Name: users_kyc_status_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX users_kyc_status_idx ON public.users USING btree (kyc_status);


--
-- Name: users_verificationToken_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX "users_verificationToken_key" ON public.users USING btree ("verificationToken");


--
-- Name: users_wallet_address_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX users_wallet_address_idx ON public.users USING btree (wallet_address);


--
-- Name: users_wallet_address_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX users_wallet_address_key ON public.users USING btree (wallet_address);


--
-- Name: votes_proposal_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX votes_proposal_id_idx ON public.votes USING btree (proposal_id);


--
-- Name: votes_proposal_id_user_id_key; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE UNIQUE INDEX votes_proposal_id_user_id_key ON public.votes USING btree (proposal_id, user_id);


--
-- Name: votes_user_id_idx; Type: INDEX; Schema: public; Owner: digirealassets_db_user
--

CREATE INDEX votes_user_id_idx ON public.votes USING btree (user_id);


--
-- Name: bookings bookings_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: investor_yields fk_investment_optional; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investment_optional FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON DELETE SET NULL;


--
-- Name: investor_yields fk_investor_user; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investor_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: investor_yields fk_investor_yield_distribution; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investor_yield_distribution FOREIGN KEY (yield_distribution_id) REFERENCES public.yield_distributions(id) ON DELETE CASCADE;


--
-- Name: settlements fk_settlement_booking; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT fk_settlement_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: settlements fk_settlement_hotel; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT fk_settlement_hotel FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON DELETE CASCADE;


--
-- Name: yield_distributions fk_yield_asset; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT fk_yield_asset FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON DELETE CASCADE;


--
-- Name: yield_distributions fk_yield_booking; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT fk_yield_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: hotel_assets hotel_assets_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT hotel_assets_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: investments investments_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: investments investments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: kyc kyc_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: kyc kyc_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_booking_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_booking_fkey FOREIGN KEY ("bookingId") REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: proposals proposals_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: proposals proposals_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: proposals proposals_proposer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: staking staking_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: staking staking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: votes votes_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digirealassets_db_user
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: digirealassets_db_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO digirealassets_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO digirealassets_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO digirealassets_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO digirealassets_db_user;


--
-- PostgreSQL database dump complete
--

\unrestrict PwHmvxxuiSYpV3FSjFVjWcOUqgilaYNtJU2XTetxp0tQYIyUjhAcnyK0FQu42bd

