--
-- PostgreSQL database dump
--

\restrict IxU676J1Cf2yf2veInNYuz8RQ1a9fwPqg2wIfKgqoxnsGdNZDzbWibzSKYlThdj

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: digiuser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO digiuser;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: digiuser
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AssetStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."AssetStatus" AS ENUM (
    'UPCOMING',
    'ACTIVE',
    'SOLD_OUT',
    'CLOSED'
);


ALTER TYPE public."AssetStatus" OWNER TO digiuser;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."BookingStatus" OWNER TO digiuser;

--
-- Name: DocumentType; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."DocumentType" AS ENUM (
    'PASSPORT',
    'DRIVERS_LICENSE',
    'NATIONAL_ID',
    'RESIDENCE_PERMIT'
);


ALTER TYPE public."DocumentType" OWNER TO digiuser;

--
-- Name: InvestmentStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."InvestmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'CANCELLED',
    'ACTIVE'
);


ALTER TYPE public."InvestmentStatus" OWNER TO digiuser;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: digiuser
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


ALTER TYPE public."KycStatus" OWNER TO digiuser;

--
-- Name: ProposalStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."ProposalStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'APPROVED',
    'REJECTED',
    'EXECUTED'
);


ALTER TYPE public."ProposalStatus" OWNER TO digiuser;

--
-- Name: ProposalType; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."ProposalType" AS ENUM (
    'RENOVATION',
    'EXPANSION',
    'POLICY_CHANGE',
    'DIVIDEND_DISTRIBUTION',
    'OTHER'
);


ALTER TYPE public."ProposalType" OWNER TO digiuser;

--
-- Name: StakingStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."StakingStatus" AS ENUM (
    'ACTIVE',
    'UNSTAKED',
    'REWARDED',
    'CLOSED'
);


ALTER TYPE public."StakingStatus" OWNER TO digiuser;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN',
    'PROPERTY_MANAGER',
    'COMPLIANCE_OFFICER',
    'FINANCE_MANAGER'
);


ALTER TYPE public."UserRole" OWNER TO digiuser;

--
-- Name: VerificationLevel; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."VerificationLevel" AS ENUM (
    'BASIC',
    'INTERMEDIATE',
    'ADVANCED',
    'FULL'
);


ALTER TYPE public."VerificationLevel" OWNER TO digiuser;

--
-- Name: VoteChoice; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."VoteChoice" AS ENUM (
    'FOR',
    'AGAINST',
    'ABSTAIN'
);


ALTER TYPE public."VoteChoice" OWNER TO digiuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: digiuser
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


ALTER TABLE public._prisma_migrations OWNER TO digiuser;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: digiuser
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
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bookings OWNER TO digiuser;

--
-- Name: hotel_assets; Type: TABLE; Schema: public; Owner: digiuser
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
    total_value integer
);


ALTER TABLE public.hotel_assets OWNER TO digiuser;

--
-- Name: investments; Type: TABLE; Schema: public; Owner: digiuser
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
    token_amount integer NOT NULL
);


ALTER TABLE public.investments OWNER TO digiuser;

--
-- Name: kyc; Type: TABLE; Schema: public; Owner: digiuser
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


ALTER TABLE public.kyc OWNER TO digiuser;

--
-- Name: proposals; Type: TABLE; Schema: public; Owner: digiuser
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
    created_by_id text NOT NULL
);


ALTER TABLE public.proposals OWNER TO digiuser;

--
-- Name: staking; Type: TABLE; Schema: public; Owner: digiuser
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


ALTER TABLE public.staking OWNER TO digiuser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: digiuser
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
    verification_level public."VerificationLevel"
);


ALTER TABLE public.users OWNER TO digiuser;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: digiuser
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


ALTER TABLE public.votes OWNER TO digiuser;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d7a08d5e-1a79-4e3c-b32f-912d8f0cb730	9212d341f28526060b713802f844d0eaa45c09fbe2cc6627ac53be42485ad315	2025-12-24 11:55:25.344605+08	20251217073933_init	\N	\N	2025-12-24 11:55:25.26732+08	1
69010678-39a1-4642-baf2-2d1985f661b1	861e8d9dcefcd32d021a070634747583b31bd3e5dc1ad577755fb898a84b8515	2025-12-24 11:55:25.375729+08	20251222151810_add_kyc_blockchain_integration	\N	\N	2025-12-24 11:55:25.346124+08	1
2df2d329-0cf3-435d-9599-43867aac04c5	9b156e0d5928dc9d7dd65816879265eacb51865eb686d02ad6bcefc564f10494	2025-12-24 12:01:57.324132+08	20251224040157_fix_kyc_migration	\N	\N	2025-12-24 12:01:57.318914+08	1
0b644b58-f0be-49d8-84df-7968853e6c37	5b9b6d148410cc10446eda86374d257095542eec17f3ae6827b004d1aec37379	2025-12-25 00:23:07.881438+08	20251224162307_remove_old_kyc_fields	\N	\N	2025-12-25 00:23:07.841294+08	1
b0101de5-a07d-40eb-a2c5-7f5e57638518	69b6cda7ab46257f11d3c264cd4e6ad1efea78f2743ca029ac8a70ce2e4acac7	2025-12-25 11:09:12.480609+08	20251225030912_add_expired_kyc_status	\N	\N	2025-12-25 11:09:12.476701+08	1
7f5c994e-ed8e-47d6-9adb-87a5a67fc393	c23bb85be44ac558d4caea38de4db436325e11f75b5b2fbb531de244c2a307a9	2025-12-25 11:19:40.359627+08	20251225031940_add_kyc_status_field	\N	\N	2025-12-25 11:19:40.355178+08	1
0a78fc74-b04a-4988-895d-b01a175f12ea	30e322d57b487bfdfb9a9138d9704ae4c3dbb206c9ac1cbf1623ae8c0c61f93c	2025-12-25 13:47:15.381076+08	20251225054715_add_blockchain_fields	\N	\N	2025-12-25 13:47:15.374819+08	1
1a353070-a2ee-4c8b-a346-ef3f9eeb9978	a9d822bbcf3db921013f985027c9fd43669a0008c2c8dcf3b86cc18a9aed8154	2025-12-27 18:02:09.027949+08	20251227100209_add_kyc_file_fields	\N	\N	2025-12-27 18:02:09.023029+08	1
5043b2f4-3ab0-447c-a0e3-977fbe9a9273	2e6a746725ab43b872eb8bdf594717f3611b8614b427f6cad8037a27dcc61ef5	2026-01-02 20:51:48.438284+08	20260102125148_add_all_missing_columns	\N	\N	2026-01-02 20:51:48.427777+08	1
150d7796-e34a-40b2-b244-ab6636067f9c	6b33d8e56f5dab6f2fdf52b41681264624ba257b183f2b34d9e834a8b8e20197	2026-01-03 00:55:37.904339+08	20260102165537_add_csv_fields_to_investments	\N	\N	2026-01-03 00:55:37.897187+08	1
cddd8b0a-79cc-4204-ad89-4b927bce0828	a11659d46283929170ba4541eb524eef0b5a4c9217455019ab424e8aaa975125	2026-01-03 01:16:31.021877+08	20260102171631_add_csv_fields_to_investments	\N	\N	2026-01-03 01:16:31.01722+08	1
a7eda206-2859-4083-9a9a-effc17f1e403	935cb31720e4a957264a5dda50d7e8c12546257b57ddf56e3c2e48e5a6f784ff	2026-01-03 01:56:54.91425+08	20260102175654_add_csv_fields_to_investments	\N	\N	2026-01-03 01:56:54.910603+08	1
4725f54d-b6e5-420f-a5e2-6027cd023459	d410d82595b7c73bd1e6cea887ac45118892d71ae3fd6c35c0b1276524a5f8cd	2026-01-03 06:04:02.276684+08	20260102220402_staking	\N	\N	2026-01-03 06:04:02.252872+08	1
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.bookings (id, user_id, hotel_asset_id, check_in_date, check_out_date, guests, room_type, total_price, status, special_requests, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hotel_assets; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.hotel_assets (id, name, location, status, description, created_at, updated_at, created_by_id, apy, country, created_by, esg_score, image_url, is_sample, lease_end_date, occupancy_rate, revpar, room_count, star_rating, token_price, token_symbol, tokens_sold, total_tokens, total_value) FROM stdin;
692bf7e5e51d3a2d1ee44f6a	曼谷瑰丽酒店	曼谷	ACTIVE	位于曼谷核心商务区的五星级精品酒店，拥有180间客房和顶级设施。酒店已获得绿色认证，配备IoT节能系统，为住客提供ESG奖励计划。	2025-11-30 07:53:09.911	2025-12-10 08:29:27.657	692bf61c278f72b74d27f374	8.5	泰国	dengdi1989@hotmail.com	85	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800	f	2030-12-31 00:00:00	87	145	180	5	10	HAT-BKK	175110	250000	2500000
692bf7e5e51d3a2d1ee44f6b	普吉岛海景度假村	普吉岛	ACTIVE	坐落于普吉岛西海岸的豪华度假村，私人海滩、无边泳池和水疗中心。采用太阳能发电和雨水回收系统，ESG评分业界领先。	2025-11-30 07:53:09.911	2025-12-10 06:33:23.653	692bf61c278f72b74d27f374	9.2	泰国	dengdi1989@hotmail.com	92	https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800	f	2031-06-30 00:00:00	82	168	250	5	10	HAT-PHK	228110	380000	3800000
692bf7e5e51d3a2d1ee44f6c	香港中环商务酒店	香港中环	ACTIVE	位于香港金融核心地带的商务酒店，毗邻IFC和地铁站。高入住率和稳定RevPAR，是机构投资者的优质选择。	2025-11-30 07:53:09.911	2025-12-10 12:20:45.073	692bf61c278f72b74d27f374	7.8	香港	dengdi1989@hotmail.com	78	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800	f	2029-12-31 00:00:00	91	210	320	4	10	HAT-HKG	364010	520000	5200000
692bf7e5e51d3a2d1ee44f6d	巴厘岛乌布丛林酒店	乌布	ACTIVE	隐藏在乌布热带雨林中的生态精品酒店，每间别墅都配有私人泳池。100%使用可再生能源，是ESG示范项目。	2025-11-30 07:53:09.911	2025-11-30 07:53:09.911	692bf61c278f72b74d27f374	10.2	印度尼西亚	dengdi1989@hotmail.com	95	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800	f	2032-03-31 00:00:00	76	132	65	5	10	HAT-BAL	54000	180000	1800000
692bf7e5e51d3a2d1ee44f6e	东京银座精选酒店	东京银座	SOLD_OUT	位于东京最繁华商圈银座的顶级酒店，日式极简设计与现代科技完美融合。代币已售罄，但仍可享受代币持有者专属权益。	2025-11-30 07:53:09.911	2025-11-30 07:53:09.911	692bf61c278f72b74d27f374	7.5	日本	dengdi1989@hotmail.com	82	https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800	f	2030-09-30 00:00:00	94	195	280	5	10	HAT-TYO	450000	450000	4500000
692bf7e5e51d3a2d1ee44f6f	新加坡滨海湾酒店	滨海湾	UPCOMING	即将上线的新加坡滨海湾豪华酒店项目，预计年化收益8.8%。敬请期待！	2025-11-30 07:53:09.911	2025-11-30 07:53:09.911	692bf61c278f72b74d27f374	8.8	新加坡	dengdi1989@hotmail.com	88	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800	f	2033-01-01 00:00:00	0	0	400	5	10	HAT-SIN	0	600000	6000000
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.investments (id, user_id, hotel_asset_id, transaction_hash, created_at, updated_at, status, amount, created_by, created_by_id, earned_rewards, invested_amount, is_sample, pending_rewards, staked_amount, token_amount) FROM stdin;
6939659c03bb62259e189f7c	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6c	\N	2025-12-10 12:20:44.434	2025-12-10 12:20:44.434	ACTIVE	100.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	100.00	f	0.00	0.00	10
69392f678417e28fd99419f4	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6a	\N	2025-12-10 08:29:27.194	2025-12-10 08:29:27.194	ACTIVE	100.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	100.00	f	0.00	0.00	10
6939143231d6db4e73fc6a25	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6b	\N	2025-12-10 06:33:22.989	2025-12-10 06:33:22.989	ACTIVE	1000.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	1000.00	f	0.00	0.00	100
692ee8c51b5615e02c073ed4	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6b	\N	2025-12-02 13:25:25.096	2025-12-02 13:25:25.096	ACTIVE	100.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	100.00	f	0.00	0.00	10
692c65b99c56b80c5c3f0693	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6a	\N	2025-11-30 15:41:45.824	2025-11-30 15:41:45.824	ACTIVE	500.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	500.00	f	0.00	0.00	50
692bfb14ada7512f25ef5202	692bf61c278f72b74d27f374	692bf7e5e51d3a2d1ee44f6a	\N	2025-11-30 08:06:44.449	2025-11-30 08:06:44.449	ACTIVE	500.00	dengdi1989@hotmail.com	692bf61c278f72b74d27f374	0.00	500.00	f	0.00	0.00	50
\.


--
-- Data for Name: kyc; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.kyc (id, user_id, full_name, date_of_birth, nationality, city, state, postal_code, country, rejection_reason, submitted_at, reviewed_at, reviewed_by, created_at, updated_at, address, document_number, document_type, status, "approvedAt", "blockchainTx", "blockchainVerifier", "documentHash", "expiresAt", address_proof, document_back, document_front, selfie_image) FROM stdin;
f1829b59-abe3-4512-ace3-48d70fa1668d	34512025-8042-4d3e-a2f0-70c00e8071f6	ADONI KADJO MATHIAS	1994-02-27 00:00:00	Cote d'Ivoire	Shenzhen	Guangdong	1105	Cote d'ivoire	\N	2025-12-27 11:07:07.918	2025-12-27 11:09:34.252	34512025-8042-4d3e-a2f0-70c00e8071f6	2025-12-27 11:07:07.918	2025-12-27 11:09:34.253	深圳市宝安区福海街道展城社区会展湾中港1栋1805	24AV52742	passport	APPROVED	2025-12-27 11:09:34.252	\N	\N	\N	\N	\N	documentBack-1766833627888-341686202.jpg	documentFront-1766833627881-533514981.jpg	selfieImage-1766833627890-760962857.jpg
e9646f73-c6ae-4fad-aa66-e6f355b9c328	1fc06d8f-0812-45bd-a8fa-fd300e66f2da	Yuan chan	2005-06-27 00:00:00	China	Dalian	liaoning	114346	China	passport invalid	2025-12-27 15:13:44.913	2025-12-28 03:37:48.703	1fc06d8f-0812-45bd-a8fa-fd300e66f2da	2025-12-27 15:13:44.913	2025-12-28 03:37:48.704	dalian liggon 245 Road	34T6798	passport	REJECTED	\N	\N	\N	\N	\N	\N	documentBack-1766848424898-515805989.jpg	documentFront-1766848424890-472363344.jpg	selfieImage-1766848424903-106298316.jpg
d1d73a3c-4834-442d-ac19-a862c179434c	4575ef8b-b635-426a-aad9-e748b8c87055	DENGD  	1988-03-29 00:00:00	CHINA	CHINA	LIOANING	2457	CHINA	\N	2025-12-29 02:29:15.616	2025-12-29 02:32:12.16	4575ef8b-b635-426a-aad9-e748b8c87055	2025-12-29 02:29:15.616	2025-12-29 02:32:12.162	深圳市宝安区福海街道展城社区会展湾中港1栋1805	23RT0695	PASSPORT	APPROVED	2025-12-29 02:32:12.16	\N	\N	\N	\N	\N	documentBack-1766975355572-558919043.jpg	documentFront-1766975355564-945340057.jpg	selfieImage-1766975355574-919493507.jpg
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.proposals (id, title, description, type, proposer_id, hotel_asset_id, status, voting_start_date, voting_end_date, votes_for, votes_against, votes_abstain, quorum_required, approval_threshold, execution_details, created_at, updated_at, created_by_id) FROM stdin;
692c6455e59e4be18c9aa2ef	Test	Testo	OTHER	692bf61c278f72b74d27f374	\N	ACTIVE	\N	2025-12-07 15:35:50.48	100	100	0	1000	50	\N	2025-11-30 15:35:49.271	2025-11-30 15:36:16.923	692bf61c278f72b74d27f374
692bf7e5e51d3a2d1ee44f70	收购越南岘港海滨度假村	提议使用平台资金收购越南岘港一家五星级海滨度假村，预计代币化后可提供9.5%年化收益。该物业位于岘港核心旅游区，拥有200间客房和私人海滩。	OTHER	693a1001c1a2cbe128aa1001	\N	ACTIVE	\N	2025-02-15 00:00:00	125000	35000	0	100000	50	\N	2025-11-30 07:53:09.915	2025-11-30 07:53:09.915	692bf61c278f72b74d27f374
692bf7e5e51d3a2d1ee44f71	降低平台交易费用至0.2%	当前平台交易费为0.5%，提议降低至0.2%以吸引更多投资者参与。预计可提升交易量50%以上。	OTHER	693a1001c1a2cbe128aa1002	\N	ACTIVE	\N	2025-02-10 00:00:00	89000	76000	0	100000	50	\N	2025-11-30 07:53:09.915	2025-11-30 07:53:09.915	692bf61c278f72b74d27f374
692bf7e5e51d3a2d1ee44f72	与万豪集团建立战略合作	提议与万豪国际酒店集团建立战略合作关系，优先代币化其在亚太地区的优质物业。	OTHER	693a1001c1a2cbe128aa1003	\N	APPROVED	\N	2025-01-20 00:00:00	230000	25000	0	100000	50	\N	2025-11-30 07:53:09.915	2025-11-30 07:53:09.915	692bf61c278f72b74d27f374
\.


--
-- Data for Name: staking; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.staking (id, user_id, staked_amount, lock_period_days, stake_start_date, stake_end_date, apy_rate, earned_rewards, claimed_rewards, voting_power_multiplier, status, created_at, updated_at, created_by_id, is_sample) FROM stdin;
69327dedb42a6d12d196303d	692bf61c278f72b74d27f374	1000	90	2025-12-05 06:38:36.402	2026-03-05 06:38:36.402	12	0	0	1.5	ACTIVE	2025-12-05 06:38:37.035	2025-12-05 06:38:37.035	692bf61c278f72b74d27f374	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.users (id, email, password, first_name, last_name, phone, role, is_email_verified, email_verified_at, kyc_status, kyc_submitted_at, kyc_approved_at, wallet_address, created_at, updated_at, kyc_expires_at, verification_level) FROM stdin;
fe308169-8e55-4c6b-b17e-2c31d7db846c	zhang127@gmail.com	$2b$10$bV3h81zrf7U9.RRuf4gm9.IA4ri8FqEMjF79Sc9RI5r8AO.1BsWfK	zhang	yu	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-01 12:15:40.449	2026-01-01 12:15:40.449	\N	\N
b319993d-456c-41cf-b48f-1ffbd85eb19e	kona@gmail.com	$2b$10$gwXBvmL67YiNB2I/p./v7OpAV1cDGT4EpeJQlZxOqhxkaLBC84IAu	ASSIE	KONANATE	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-02 07:35:26.057	2026-01-02 07:35:26.057	\N	\N
69da0d91-5787-498e-8685-b80cd8b644ff	ata@gmail.com	$2b$10$q8nAtDAH.FwZF5CQYRpL/O7bDan0/VSeqCa.YgogDABemZ4y9eVTO	ATTA	KOUADIO	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-02 08:25:10.414	2026-01-02 08:25:10.414	\N	\N
34512025-8042-4d3e-a2f0-70c00e8071f6	adonimathias53@gmail.com	$2b$10$smLueFB2Pi/807JrnaMWdeDbilMSYkVONU9niCD5EcR8P2i9v60qm	Adoni	Mathias	\N	USER	f	\N	PENDING	\N	\N	0x09b5657527A5247807ff357814440355f485854A	2025-12-27 03:56:00.004	2025-12-27 14:34:17.423	\N	\N
904702e6-48f2-4798-9a64-953f5fc33fac	413785703@qq.com	$2b$10$JEH75W1OVhULsobcvnKqv.PSar0HmmpY4O9zfsX1Gcc.2ktYF7W.m	dean	deng	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-02 08:27:20.651	2026-01-02 08:27:20.651	\N	\N
1fc06d8f-0812-45bd-a8fa-fd300e66f2da	12348@gmail.com	$2b$10$5ydfDdRdQPKOfDWLJcxvEu6jYKEIkAP9qqYcS1.RSUltE9iBCrcsK	Yuan	chang	\N	USER	f	\N	PENDING	\N	\N	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2025-12-27 15:00:38.349	2025-12-28 03:11:48.292	\N	\N
4575ef8b-b635-426a-aad9-e748b8c87055	18123635200@163.com	$2b$10$tIOBqPloN4bM4l5Yklpkz.fLXnPHIvqrwuqlxsHxj5exLMfdy1qDC	DENG	DI	\N	USER	f	\N	PENDING	\N	\N	\N	2025-12-29 02:20:32.604	2025-12-29 02:20:32.604	\N	\N
2cd5dd87-aff6-4e4c-bde5-5693e0402d53	kadjo@gmail.com	$2b$10$TPZslaQ7VZg60ZSlDyrYD.VvEMP6SgXJJJzW8pvTgv9DGH3f5Zxzq	Adou	Mathias	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-02 09:31:01.053	2026-01-02 09:31:01.053	\N	\N
780e4192-a165-4393-8f4d-803f7356ad78	134576@gmail.com	$2b$10$YY0H0vDw8TSYqomKcuJ63uKmabunnlWglq1ifzH7pYjp6crwDO5JW	john	yuan	\N	USER	f	\N	PENDING	\N	\N	\N	2025-12-31 01:17:37.802	2025-12-31 01:17:37.802	\N	\N
692bf61c278f72b74d27f374	dengdi1989@hotmail.com	$2b$10$x/Yuw2QJvb4cnuobZZlogeg1Hru79hZfrx.84U31hg4vwL6xQT2O2	zhang	yu	\N	USER	f	\N	PENDING	\N	\N	\N	2026-01-01 13:00:54.738	2026-01-01 13:00:54.738	\N	\N
693a1001c1a2cbe128aa1001	dean@digireal.com	$2b$10$PLACEHOLDER_DEAN	Dean	\N	\N	USER	f	\N	NOT_STARTED	\N	\N	\N	2026-01-03 05:39:52.774	2026-01-03 05:39:52.774	\N	\N
693a1001c1a2cbe128aa1002	community@digireal.com	$2b$10$PLACEHOLDER_COMMUNITY	Community	\N	\N	USER	f	\N	NOT_STARTED	\N	\N	\N	2026-01-03 05:39:52.774	2026-01-03 05:39:52.774	\N	\N
693a1001c1a2cbe128aa1003	partnerships@digireal.com	$2b$10$PLACEHOLDER_PARTNERSHIPS	Partnerships	\N	\N	USER	f	\N	NOT_STARTED	\N	\N	\N	2026-01-03 05:39:52.774	2026-01-03 05:39:52.774	\N	\N
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.votes (id, proposal_id, user_id, choice, voting_power, comment, created_at) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: hotel_assets hotel_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT hotel_assets_pkey PRIMARY KEY (id);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: kyc kyc_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: staking staking_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: bookings_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_hotel_asset_id_idx ON public.bookings USING btree (hotel_asset_id);


--
-- Name: bookings_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_status_idx ON public.bookings USING btree (status);


--
-- Name: bookings_user_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_user_id_idx ON public.bookings USING btree (user_id);


--
-- Name: investments_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX investments_hotel_asset_id_idx ON public.investments USING btree (hotel_asset_id);


--
-- Name: investments_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX investments_status_idx ON public.investments USING btree (status);


--
-- Name: investments_transaction_hash_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX investments_transaction_hash_idx ON public.investments USING btree (transaction_hash);


--
-- Name: investments_user_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX investments_user_id_idx ON public.investments USING btree (user_id);


--
-- Name: kyc_reviewed_by_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX kyc_reviewed_by_idx ON public.kyc USING btree (reviewed_by);


--
-- Name: kyc_user_id_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX kyc_user_id_key ON public.kyc USING btree (user_id);


--
-- Name: proposals_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX proposals_hotel_asset_id_idx ON public.proposals USING btree (hotel_asset_id);


--
-- Name: proposals_proposer_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX proposals_proposer_id_idx ON public.proposals USING btree (proposer_id);


--
-- Name: proposals_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX proposals_status_idx ON public.proposals USING btree (status);


--
-- Name: staking_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX staking_status_idx ON public.staking USING btree (status);


--
-- Name: staking_user_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX staking_user_id_idx ON public.staking USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_kyc_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX users_kyc_status_idx ON public.users USING btree (kyc_status);


--
-- Name: users_wallet_address_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX users_wallet_address_idx ON public.users USING btree (wallet_address);


--
-- Name: users_wallet_address_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX users_wallet_address_key ON public.users USING btree (wallet_address);


--
-- Name: votes_proposal_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX votes_proposal_id_idx ON public.votes USING btree (proposal_id);


--
-- Name: votes_proposal_id_user_id_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX votes_proposal_id_user_id_key ON public.votes USING btree (proposal_id, user_id);


--
-- Name: votes_user_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX votes_user_id_idx ON public.votes USING btree (user_id);


--
-- Name: bookings bookings_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hotel_assets hotel_assets_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT hotel_assets_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: investments investments_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: investments investments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: kyc kyc_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: kyc kyc_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: proposals proposals_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: proposals proposals_hotel_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_hotel_asset_id_fkey FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: proposals proposals_proposer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: staking staking_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: staking staking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: votes votes_proposal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.proposals(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: votes votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: digiuser
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict IxU676J1Cf2yf2veInNYuz8RQ1a9fwPqg2wIfKgqoxnsGdNZDzbWibzSKYlThdj

