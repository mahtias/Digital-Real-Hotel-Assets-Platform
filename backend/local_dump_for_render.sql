--
-- PostgreSQL database dump
--

\restrict agZRoUvE1061gdUe3YvbshdVkZnUcJifbfQfeL0G6DyBFpMiQWt6S83lUUGa3EL

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
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

ALTER TABLE IF EXISTS ONLY public.votes DROP CONSTRAINT IF EXISTS votes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.votes DROP CONSTRAINT IF EXISTS votes_proposal_id_fkey;
ALTER TABLE IF EXISTS ONLY public.treasury DROP CONSTRAINT IF EXISTS "treasury_hotelAssetId_fkey";
ALTER TABLE IF EXISTS ONLY public.staking DROP CONSTRAINT IF EXISTS staking_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.staking DROP CONSTRAINT IF EXISTS staking_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_proposer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_hotel_asset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS payment_booking_fkey;
ALTER TABLE IF EXISTS ONLY public.kyc DROP CONSTRAINT IF EXISTS kyc_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.kyc DROP CONSTRAINT IF EXISTS kyc_reviewed_by_fkey;
ALTER TABLE IF EXISTS ONLY public.investments DROP CONSTRAINT IF EXISTS investments_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.investments DROP CONSTRAINT IF EXISTS investments_hotel_asset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.hotel_assets DROP CONSTRAINT IF EXISTS hotel_assets_created_by_id_fkey;
ALTER TABLE IF EXISTS ONLY public.yield_distributions DROP CONSTRAINT IF EXISTS fk_yield_booking;
ALTER TABLE IF EXISTS ONLY public.yield_distributions DROP CONSTRAINT IF EXISTS fk_yield_asset;
ALTER TABLE IF EXISTS ONLY public.settlements DROP CONSTRAINT IF EXISTS fk_settlement_hotel;
ALTER TABLE IF EXISTS ONLY public.settlements DROP CONSTRAINT IF EXISTS fk_settlement_booking;
ALTER TABLE IF EXISTS ONLY public.investor_yields DROP CONSTRAINT IF EXISTS fk_investor_yield_distribution;
ALTER TABLE IF EXISTS ONLY public.investor_yields DROP CONSTRAINT IF EXISTS fk_investor_user;
ALTER TABLE IF EXISTS ONLY public.investor_yields DROP CONSTRAINT IF EXISTS fk_investment_optional;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_hotel_asset_id_fkey;
DROP INDEX IF EXISTS public.votes_user_id_idx;
DROP INDEX IF EXISTS public.votes_proposal_id_user_id_key;
DROP INDEX IF EXISTS public.votes_proposal_id_idx;
DROP INDEX IF EXISTS public.users_wallet_address_key;
DROP INDEX IF EXISTS public.users_wallet_address_idx;
DROP INDEX IF EXISTS public."users_verificationToken_key";
DROP INDEX IF EXISTS public.users_kyc_status_idx;
DROP INDEX IF EXISTS public.users_kyc_blockchain_synced_idx;
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public.users_email_idx;
DROP INDEX IF EXISTS public.staking_user_id_idx;
DROP INDEX IF EXISTS public.staking_status_idx;
DROP INDEX IF EXISTS public.proposals_status_idx;
DROP INDEX IF EXISTS public.proposals_proposer_id_idx;
DROP INDEX IF EXISTS public.proposals_hotel_asset_id_idx;
DROP INDEX IF EXISTS public.kyc_user_id_key;
DROP INDEX IF EXISTS public.kyc_reviewed_by_idx;
DROP INDEX IF EXISTS public.investments_user_id_idx;
DROP INDEX IF EXISTS public.investments_transaction_hash_idx;
DROP INDEX IF EXISTS public.investments_status_idx;
DROP INDEX IF EXISTS public.investments_hotel_asset_id_idx;
DROP INDEX IF EXISTS public."investments_blockchainStatus_idx";
DROP INDEX IF EXISTS public."hotel_assets_tokenId_key";
DROP INDEX IF EXISTS public.hotel_assets_blockchain_id_key;
DROP INDEX IF EXISTS public.bookings_user_id_idx;
DROP INDEX IF EXISTS public.bookings_status_idx;
DROP INDEX IF EXISTS public."bookings_qloOrderId_key";
DROP INDEX IF EXISTS public.bookings_hotel_asset_id_idx;
DROP INDEX IF EXISTS public.bookings_booking_code_key;
ALTER TABLE IF EXISTS ONLY public.yield_distributions DROP CONSTRAINT IF EXISTS yield_distributions_pkey;
ALTER TABLE IF EXISTS ONLY public.votes DROP CONSTRAINT IF EXISTS votes_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.hotel_assets DROP CONSTRAINT IF EXISTS unique_token_address;
ALTER TABLE IF EXISTS ONLY public.treasury DROP CONSTRAINT IF EXISTS treasury_pkey;
ALTER TABLE IF EXISTS ONLY public.staking DROP CONSTRAINT IF EXISTS staking_pkey;
ALTER TABLE IF EXISTS ONLY public.settlements DROP CONSTRAINT IF EXISTS settlements_pkey;
ALTER TABLE IF EXISTS ONLY public.proposals DROP CONSTRAINT IF EXISTS proposals_pkey;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS payment_pkey;
ALTER TABLE IF EXISTS ONLY public.kyc DROP CONSTRAINT IF EXISTS kyc_pkey;
ALTER TABLE IF EXISTS ONLY public.investor_yields DROP CONSTRAINT IF EXISTS investor_yields_pkey;
ALTER TABLE IF EXISTS ONLY public.investments DROP CONSTRAINT IF EXISTS investments_pkey;
ALTER TABLE IF EXISTS ONLY public.hotel_assets DROP CONSTRAINT IF EXISTS hotel_assets_pkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."EsgReward" DROP CONSTRAINT IF EXISTS "EsgReward_pkey";
DROP TABLE IF EXISTS public.yield_distributions;
DROP TABLE IF EXISTS public.votes;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.treasury;
DROP TABLE IF EXISTS public.staking;
DROP TABLE IF EXISTS public.settlements;
DROP TABLE IF EXISTS public.proposals;
DROP TABLE IF EXISTS public.payment;
DROP TABLE IF EXISTS public.kyc;
DROP TABLE IF EXISTS public.investor_yields;
DROP TABLE IF EXISTS public.investments;
DROP TABLE IF EXISTS public.hotel_assets;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."EsgReward";
DROP TYPE IF EXISTS public."VoteChoice";
DROP TYPE IF EXISTS public."VerificationLevel";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."StakingStatus";
DROP TYPE IF EXISTS public."ProposalType";
DROP TYPE IF EXISTS public."ProposalStatus";
DROP TYPE IF EXISTS public."ProposalCategory";
DROP TYPE IF EXISTS public."KycStatus";
DROP TYPE IF EXISTS public."InvestmentStatus";
DROP TYPE IF EXISTS public."ESGRewardStatus";
DROP TYPE IF EXISTS public."ESGActionType";
DROP TYPE IF EXISTS public."DocumentType";
DROP TYPE IF EXISTS public."BookingStatus";
DROP TYPE IF EXISTS public."AssetStatus";
-- *not* dropping schema, since initdb creates it
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
    'CLOSED',
    'FUNDRAISING'
);


ALTER TYPE public."AssetStatus" OWNER TO digiuser;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'PAID'
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
-- Name: ESGActionType; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."ESGActionType" AS ENUM (
    'ac_off',
    'towel_reuse',
    'no_cleaning',
    'water_saving',
    'recycling'
);


ALTER TYPE public."ESGActionType" OWNER TO digiuser;

--
-- Name: ESGRewardStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."ESGRewardStatus" AS ENUM (
    'pending',
    'verified',
    'claimed'
);


ALTER TYPE public."ESGRewardStatus" OWNER TO digiuser;

--
-- Name: InvestmentStatus; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."InvestmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'FAILED',
    'CANCELLED',
    'ACTIVE',
    'DELETED'
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
-- Name: ProposalCategory; Type: TYPE; Schema: public; Owner: digiuser
--

CREATE TYPE public."ProposalCategory" AS ENUM (
    'asset_acquisition',
    'fee_adjustment',
    'partnership',
    'platform_upgrade',
    'esg_initiative'
);


ALTER TYPE public."ProposalCategory" OWNER TO digiuser;

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
-- Name: EsgReward; Type: TABLE; Schema: public; Owner: digiuser
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


ALTER TABLE public."EsgReward" OWNER TO digiuser;

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
    id uuid NOT NULL,
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
    total_value integer,
    "tokenId" integer,
    token_address text,
    blockchain_id integer,
    wallet_address text,
    "stablecoinAddress" text,
    qlo_hotel_id integer
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
    token_amount numeric(18,8) NOT NULL,
    "blockchainStatus" text DEFAULT 'PENDING'::text,
    blockchain_tx_hash text,
    deleted_at timestamp(3) without time zone,
    "walletAddress" text,
    "blockchainError" text,
    platform_fee numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.investments OWNER TO digiuser;

--
-- Name: investor_yields; Type: TABLE; Schema: public; Owner: digiuser
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
    updated_at timestamp without time zone DEFAULT now(),
    failure_reason text,
    paid_at timestamp(3) without time zone,
    stablecoin_symbol text,
    wallet_address text
);


ALTER TABLE public.investor_yields OWNER TO digiuser;

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
-- Name: payment; Type: TABLE; Schema: public; Owner: digiuser
--

CREATE TABLE public.payment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "bookingId" uuid NOT NULL,
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


ALTER TABLE public.payment OWNER TO digiuser;

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
    created_by_id text NOT NULL,
    category public."ProposalCategory"
);


ALTER TABLE public.proposals OWNER TO digiuser;

--
-- Name: settlements; Type: TABLE; Schema: public; Owner: digiuser
--

CREATE TABLE public.settlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    hotel_asset_id text NOT NULL,
    hotel_wallet text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL,
    status text NOT NULL,
    tx_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "chainId" integer,
    "failureReason" text,
    "processedAt" timestamp(3) without time zone,
    stablecoin_address text,
    stablecoin_symbol text,
    retry_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.settlements OWNER TO digiuser;

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
-- Name: treasury; Type: TABLE; Schema: public; Owner: digiuser
--

CREATE TABLE public.treasury (
    id text NOT NULL,
    "hotelAssetId" text NOT NULL,
    amount double precision NOT NULL,
    type text NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.treasury OWNER TO digiuser;

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
-- Name: yield_distributions; Type: TABLE; Schema: public; Owner: digiuser
--

CREATE TABLE public.yield_distributions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    booking_id uuid NOT NULL,
    hotel_asset_id text NOT NULL,
    total_amount numeric(18,8) NOT NULL,
    distribution_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    distributed_by text,
    stablecoin_symbol text,
    status text DEFAULT 'PENDING'::text,
    tx_hash text
);


ALTER TABLE public.yield_distributions OWNER TO digiuser;

--
-- Data for Name: EsgReward; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public."EsgReward" (id, user_email, action_type, reward_amount, status, created_date, updated_at) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1e6e84de-ef3e-48cf-9f23-cd766619edfb	2b1542eb16b59c64cf3f115ab64a88b581e3fee16e3111ce436905f04017fa8a	2026-03-05 17:40:33.558359+08	20260215124033_change_token_amount_to_decimal	\N	\N	2026-03-05 17:40:33.519774+08	1
0ffd3983-dfd1-4f59-9f0a-be19fd4301c1	9212d341f28526060b713802f844d0eaa45c09fbe2cc6627ac53be42485ad315	2026-03-05 17:40:33.103514+08	20251217073933_init	\N	\N	2026-03-05 17:40:32.940764+08	1
c3c580cd-c829-4360-beda-c19e8dee2c41	785d44ee0d90975dc7ae4476a08cf9d23c8ee6cd5f7c0a5acbadb7f9d24381e5	2026-03-05 17:40:33.397534+08	20260105073639_email_verification	\N	\N	2026-03-05 17:40:33.384352+08	1
f3741d45-9a6c-4d17-9768-62be21eb73e8	861e8d9dcefcd32d021a070634747583b31bd3e5dc1ad577755fb898a84b8515	2026-03-05 17:40:33.184422+08	20251222151810_add_kyc_blockchain_integration	\N	\N	2026-03-05 17:40:33.106415+08	1
d99301c0-339b-4c8f-b048-7a03cfaac658	9b156e0d5928dc9d7dd65816879265eacb51865eb686d02ad6bcefc564f10494	2026-03-05 17:40:33.201908+08	20251224040157_fix_kyc_migration	\N	\N	2026-03-05 17:40:33.18759+08	1
a388c8d0-4337-41f8-8c3c-71c5065ed090	5b9b6d148410cc10446eda86374d257095542eec17f3ae6827b004d1aec37379	2026-03-05 17:40:33.245927+08	20251224162307_remove_old_kyc_fields	\N	\N	2026-03-05 17:40:33.205027+08	1
a4c1903c-04a1-4956-ba69-dfb90daf12e0	21b8285ac21921a7bd5de3de458f74f9111565787d0f9cb72b92cab59dda6135	2026-03-05 17:40:33.412428+08	20260105084817_email_verification	\N	\N	2026-03-05 17:40:33.401364+08	1
bd577d15-c000-47f1-bdc0-cc1c8ca7031e	69b6cda7ab46257f11d3c264cd4e6ad1efea78f2743ca029ac8a70ce2e4acac7	2026-03-05 17:40:33.257912+08	20251225030912_add_expired_kyc_status	\N	\N	2026-03-05 17:40:33.248777+08	1
87481db2-89f6-4e30-98b4-ca394f25dd59	c23bb85be44ac558d4caea38de4db436325e11f75b5b2fbb531de244c2a307a9	2026-03-05 17:40:33.271242+08	20251225031940_add_kyc_status_field	\N	\N	2026-03-05 17:40:33.260617+08	1
02791c3a-d09c-4d82-9f8e-1c1300e40175	30e322d57b487bfdfb9a9138d9704ae4c3dbb206c9ac1cbf1623ae8c0c61f93c	2026-03-05 17:40:33.284989+08	20251225054715_add_blockchain_fields	\N	\N	2026-03-05 17:40:33.274071+08	1
db09e7d5-52d5-4bca-8cc8-78776b1ee92f	b4f29ac49e4becde2f7a0452a0ce5b07d938896f058677e2eef907db16f5aefc	2026-03-05 17:40:33.425433+08	20260110160056_add_booking_fields	\N	\N	2026-03-05 17:40:33.415426+08	1
7b7471d2-1d10-4907-96ef-274a7e2af4d1	a9d822bbcf3db921013f985027c9fd43669a0008c2c8dcf3b86cc18a9aed8154	2026-03-05 17:40:33.297817+08	20251227100209_add_kyc_file_fields	\N	\N	2026-03-05 17:40:33.288301+08	1
df45d676-e3e6-427f-87c9-6ad3e887a3bd	2e6a746725ab43b872eb8bdf594717f3611b8614b427f6cad8037a27dcc61ef5	2026-03-05 17:40:33.311252+08	20260102125148_add_all_missing_columns	\N	\N	2026-03-05 17:40:33.301112+08	1
163fc26e-15f5-46e7-a65d-fbeae62e98d7	a9fa65d590c3e095547b57cc9ae3c565b8f8a90a88c3af7b477277526f5ea914	2026-03-05 17:40:33.574737+08	20260221221442_add_kyc_blockchain_sync_fields	\N	\N	2026-03-05 17:40:33.561564+08	1
2d7bf54c-ab9f-4e67-a487-ce83fab678b8	6b33d8e56f5dab6f2fdf52b41681264624ba257b183f2b34d9e834a8b8e20197	2026-03-05 17:40:33.325032+08	20260102165537_add_csv_fields_to_investments	\N	\N	2026-03-05 17:40:33.314523+08	1
d86e2d6c-5ff4-4298-a616-bfa4e9dcaef5	8b9c9131b8e8c367a0b5661d03eac2524f05d08b42186e7f9546e948ef282897	2026-03-05 17:40:33.446153+08	20260112114817_add_esg_enums	\N	\N	2026-03-05 17:40:33.428086+08	1
80a3df0c-1ca0-4e40-bd07-3ee2e869ea59	a11659d46283929170ba4541eb524eef0b5a4c9217455019ab424e8aaa975125	2026-03-05 17:40:33.336826+08	20260102171631_add_csv_fields_to_investments	\N	\N	2026-03-05 17:40:33.327946+08	1
f0adc1dc-7d02-436b-844a-22506d451cfc	935cb31720e4a957264a5dda50d7e8c12546257b57ddf56e3c2e48e5a6f784ff	2026-03-05 17:40:33.350315+08	20260102175654_add_csv_fields_to_investments	\N	\N	2026-03-05 17:40:33.34023+08	1
ce627340-30ec-4dbb-9e7a-ea05fb5f6955	d410d82595b7c73bd1e6cea887ac45118892d71ae3fd6c35c0b1276524a5f8cd	2026-03-05 17:40:33.381274+08	20260102220402_staking	\N	\N	2026-03-05 17:40:33.353242+08	1
0b9a25f3-49af-4aee-a2f8-c5fe44f3fe43	8a56a8fb19ed8d2c5146fba69b6b5f61b64b7a8056def0cc960b123669eda056	2026-03-05 17:40:33.469366+08	20260112123521_add_esg_enums	\N	\N	2026-03-05 17:40:33.449204+08	1
ffd1ed4b-4727-46f5-ac44-64f9ff44a2fb	540dbd4bded240b85792b33a08556e4eb9d7004221e1c2b7343ffd657dcf7979	2026-03-05 17:40:33.481093+08	20260113062925_add_proposal_category	\N	\N	2026-03-05 17:40:33.472125+08	1
49403b5f-e908-4140-a10c-4a32f0f8bfc0	3c17c35ff57b300aa18cd350234a29fcea6919ee0f66d34fa382a291ae00cede	2026-03-05 17:40:33.591806+08	20260221224353_add_kyc_document_hash	\N	\N	2026-03-05 17:40:33.578519+08	1
393bbf8c-b008-4c25-85b2-b69b0e0aa15a	ddf811d0ff560c3c2c8476040bc6ce2e67ea957f071fb24d57ed187465247f00	2026-03-05 17:40:33.499814+08	20260212141131_add_token_id	\N	\N	2026-03-05 17:40:33.483533+08	1
4d8cb461-6729-491b-89b0-bff8bbd9fef5	39d71b54696896930bbd2889e91b65d73c88f68e3b4a060422c032de4443336d	2026-03-05 17:40:33.515616+08	20260212145758_add_token_id	\N	\N	2026-03-05 17:40:33.502636+08	1
82a119da-0d78-400e-aee7-d789f423ecb1	56553136af70c9eb53ab57ec36741b8e9862d1b40872f41972fb46f0387dcd2f	2026-03-05 17:40:33.610488+08	20260302034932_add_blockchain_id	\N	\N	2026-03-05 17:40:33.595159+08	1
b530ff71-4a74-4350-a736-a9ac47c9f0a3	025590029bcf293c03c6dc28f438b2b410c1430295c0ab3c3a98812cd1ec57a2	2026-03-05 21:08:56.762908+08	20260305130856_add_fundraising_to_assetstatus	\N	\N	2026-03-05 21:08:56.758333+08	1
9cbd91db-3b29-4b23-bd42-3656a73e6eb2	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2026-04-13 00:19:40.045363+08	0000_baseline		\N	2026-04-13 00:19:40.045363+08	0
2d5141cb-1725-4b6b-875f-9cec55f78047	cd70ef6cf46aec0c952dcf6626c2bfbaf0b1d3cae3a6e346d4b55b80db0b9e98	2026-04-13 00:40:54.808819+08	00000000000000_baseline		\N	2026-04-13 00:40:54.808819+08	0
46af7633-ffe5-48c1-a1f0-444501e06944	cd70ef6cf46aec0c952dcf6626c2bfbaf0b1d3cae3a6e346d4b55b80db0b9e98	2026-04-13 00:49:08.743505+08	20260413000100_baseline		\N	2026-04-13 00:49:08.743505+08	0
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.bookings (id, user_id, hotel_asset_id, check_in_date, check_out_date, guests, room_type, total_price, status, special_requests, created_at, updated_at, booking_code, discount_applied, payment_method, payment_status, payment_token, platform_fee, tx_hash, wallet_address, "qloOrderId") FROM stdin;
6f604da9-6647-413a-bbae-b58626da3cd0	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	3aaeb448-d8d9-4f6a-87bd-09a1e9692414	2026-06-07 00:00:00	2026-06-08 00:00:00	2	deluxe	1.00	PAID	\N	2026-06-06 16:51:30.774	2026-06-06 16:51:54.982	DRA-BKG-2026-6WSJB	\N	\N	SUCCESS	USDC	0.10	0x7d93c63b82346d023ee1e2c993bf6a19e180892d2df0d2a4fee18cd072fbfc14	0x09b5657527A5247807ff357814440355f485854A	\N
8425b80c-b74e-4d8d-aaaa-dfe3289b503e	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	e61c8a59-6486-4ae3-a680-a430e4956d59	2026-06-07 00:00:00	2026-06-08 00:00:00	2	executive	1.50	PAID	\N	2026-06-06 17:43:44.326	2026-06-06 17:44:09.728	DRA-BKG-2026-E7IP0	\N	\N	SUCCESS	USDC	0.15	0x6e0b1165ec0dcc1272b86ed1e9a01f8311f5516cf85e1fabf6f1eafe18613ba7	0x09b5657527A5247807ff357814440355f485854A	\N
02f72502-f23f-428b-900f-a7b4e9ec8fad	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	31f98998-86bf-470e-97bd-d4e9df11a658	2026-06-07 00:00:00	2026-06-08 00:00:00	2	standard	0.50	PAID	\N	2026-06-07 04:54:42.298	2026-06-07 04:55:06.475	DRA-BKG-2026-1VYP4	\N	\N	SUCCESS	USDC	0.05	0x8ac9a92e6121702888d5feb493f8de4fccc58644b4ce810b5ae74e23f8513dac	0x09b5657527A5247807ff357814440355f485854A	26
\.


--
-- Data for Name: hotel_assets; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.hotel_assets (id, name, location, status, description, created_at, updated_at, created_by_id, apy, country, created_by, esg_score, image_url, is_sample, lease_end_date, occupancy_rate, revpar, room_count, star_rating, token_price, token_symbol, tokens_sold, total_tokens, total_value, "tokenId", token_address, blockchain_id, wallet_address, "stablecoinAddress", qlo_hotel_id) FROM stdin;
46250357-916c-4327-a3c6-241939a968f8	My Hotel Kathmandu	Kathmandu, Nepal	FUNDRAISING	\N	2026-06-06 08:09:38.595	2026-06-06 08:09:38.681	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800	\N	\N	\N	\N	\N	\N	200	DRA-MHN	0	500000	\N	\N	0x7Ef8D410f719c7152b05EfBC07e4BCa4088Ad839	1	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
34ec2ece-f4a4-4124-97b3-34d9078c841d	Marina Bay Sands	Singapore, Singapore	FUNDRAISING	\N	2026-06-06 08:09:39.125	2026-06-06 08:09:39.127	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4	\N	\N	\N	\N	\N	\N	200	DRA-MBS	0	1000000	\N	\N	0xD795c12f20d92554C3d0f4BE7e38087949Bc93af	2	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
d4d3adb6-a455-48a7-afbc-6b179d2389f3	Ritz Carlton Bali	Bali, Indonesia	FUNDRAISING	\N	2026-06-06 08:09:39.493	2026-06-06 08:09:39.495	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1582719508461-905c673771fd	\N	\N	\N	\N	\N	\N	200	DRA-RCB	0	200000	\N	\N	0x8122fE52889EFAf55800A919078AA2A3426C84fB	3	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
e61c8a59-6486-4ae3-a680-a430e4956d59	Grand Plaza Jakarta	Jakarta, Indonesia	FUNDRAISING	\N	2026-06-06 08:09:39.859	2026-06-06 08:09:39.861	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800	\N	\N	\N	\N	\N	\N	200	DRA-GPH	0	100000	\N	\N	0x786e13cF8f58eA5B09B533A775862cC8C74ED25F	4	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
31f98998-86bf-470e-97bd-d4e9df11a658	Mountain View Lodge	Bhutan	FUNDRAISING	\N	2026-06-06 08:09:41.659	2026-06-06 08:09:41.662	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800	\N	\N	\N	\N	\N	\N	200	DRA-MVL	0	80000	\N	\N	0x1E800D302b4F9E90942D4B0cCF8231286b97f6De	6	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
3aaeb448-d8d9-4f6a-87bd-09a1e9692414	Waldorf Astoria Maldives	Maldives	FUNDRAISING	\N	2026-06-06 08:09:40.631	2026-06-06 11:03:44.098	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	\N	\N	\N	\N	https://www.sbid.org/wp-content/uploads//2020/02/Hotel-design-by-Godwin-Austen-Johnson-2019-4.jpg	\N	\N	\N	\N	\N	\N	200	DRA-WAM	0	1000000	\N	\N	0x389Ab65aA8f96A271e2b6b949697fCbFd1dbDde1	5	0x09b5657527A5247807ff357814440355f485854A	0x036CbD53842c5426634e7929541eC2318f3dCF7e	1
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.investments (id, user_id, hotel_asset_id, transaction_hash, created_at, updated_at, status, amount, created_by, created_by_id, earned_rewards, invested_amount, is_sample, pending_rewards, staked_amount, token_amount, "blockchainStatus", blockchain_tx_hash, deleted_at, "walletAddress", "blockchainError", platform_fee) FROM stdin;
4a006d38-f400-449b-9004-7e1ceb822137	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	3aaeb448-d8d9-4f6a-87bd-09a1e9692414	\N	2026-06-06 10:12:14.149	2026-06-06 10:12:55.096	CONFIRMED	3.00	\N	\N	0.00	2.94	f	0.00	0.00	0.01470000	MINTED	0x8bdee06aa01aabd0efa33b86b3a0173c06ee3000a38807ff40d61a36c73c524a	\N	0x09b5657527A5247807ff357814440355f485854A	\N	0.06
e8ef2d60-04b6-42ca-97ca-1e814698b69f	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	3aaeb448-d8d9-4f6a-87bd-09a1e9692414	\N	2026-06-06 11:02:53.043	2026-06-06 11:03:44.096	CONFIRMED	200.00	\N	\N	0.00	196.00	f	0.00	0.00	0.98000000	MINTED	0x0702a5f9ffc1a933b3b3e9b9922ac9c5412a5ddfadf6a45c5ce5d1ddc5c831a3	\N	0x09b5657527A5247807ff357814440355f485854A	\N	4.00
\.


--
-- Data for Name: investor_yields; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.investor_yields (id, yield_distribution_id, user_id, investment_id, amount, status, tx_hash, created_at, updated_at, failure_reason, paid_at, stablecoin_symbol, wallet_address) FROM stdin;
\.


--
-- Data for Name: kyc; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.kyc (id, user_id, full_name, date_of_birth, nationality, city, state, postal_code, country, rejection_reason, submitted_at, reviewed_at, reviewed_by, created_at, updated_at, address, document_number, document_type, status, "approvedAt", "blockchainTx", "blockchainVerifier", "documentHash", "expiresAt", address_proof, document_back, document_front, selfie_image) FROM stdin;
3bc15941-c741-46d3-8640-1853cd2416fd	f9818c85-317c-4526-bfca-22798d612748	DEANG DEAN	2026-03-10 00:00:00	China 	Shenzhen	Guangdong	6789SZ	China	\N	2026-03-10 13:57:58.777	2026-03-11 19:49:43.816	\N	2026-03-10 13:57:58.777	2026-03-20 16:02:23.574	ShenZhen city098TY	26580YT	NCI	APPROVED	2026-03-11 19:50:14.221	already-approved	\N	0xeead5315226ba6bdc2d3dc29d92aea534d94bd23eb290267a6ecc8bbbcceb3f6	\N	addressProof-1773151078685-389151440.pdf	documentBack-1773151078664-797027183.jpg	documentFront-1773151078628-82980108.jpg	selfieImage-1773151078670-301310131.jpg
5ad0feba-1487-4c53-a9a5-bc576d596a85	85b6e6b2-b96e-4a40-8d2a-95fa16d32159	ADONI KADJO MATHIAS	2026-03-06 00:00:00	Cote d'Ivoire	Abidjan	lagune	BP06ABJ	Ivory Coast	\N	2026-03-05 18:17:30.413	2026-03-05 18:18:29.751	\N	2026-03-05 18:17:30.413	2026-03-20 16:48:08.525	ABidjanBP06	24AV52742	Passport	APPROVED	2026-03-05 18:18:30.597	already-approved	\N	\N	\N	addressProof-1772734650395-653537969.pdf	documentBack-1772734650379-500486217.jpg	documentFront-1772734650359-634482406.jpg	selfieImage-1772734650386-951381066.jpg
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.payment (id, "bookingId", amount, currency, status, "txHash", signature, receiver, "expiresAt", message, "createdAt") FROM stdin;
887a2eff-0e0f-4cd8-ad68-37cf104ba0fb	6f604da9-6647-413a-bbae-b58626da3cd0	1	USDC	CONFIRMED	0x7d93c63b82346d023ee1e2c993bf6a19e180892d2df0d2a4fee18cd072fbfc14	\N	0x27c975d0179ab7e52e83f9ee5c8213d85b0f278f	2026-06-06 17:01:30.789	\N	2026-06-06 16:51:30.79
118c2c14-9533-474f-8cdd-8e5d98661f20	8425b80c-b74e-4d8d-aaaa-dfe3289b503e	1.5	USDC	CONFIRMED	0x6e0b1165ec0dcc1272b86ed1e9a01f8311f5516cf85e1fabf6f1eafe18613ba7	\N	0x27c975d0179ab7e52e83f9ee5c8213d85b0f278f	2026-06-06 17:53:44.348	\N	2026-06-06 17:43:44.349
e9400995-7770-4bf3-8b3d-76c57e040cad	02f72502-f23f-428b-900f-a7b4e9ec8fad	0.5	USDC	CONFIRMED	0x8ac9a92e6121702888d5feb493f8de4fccc58644b4ce810b5ae74e23f8513dac	\N	0x27c975d0179ab7e52e83f9ee5c8213d85b0f278f	2026-06-07 05:04:42.318	\N	2026-06-07 04:54:42.319
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.proposals (id, title, description, type, proposer_id, hotel_asset_id, status, voting_start_date, voting_end_date, votes_for, votes_against, votes_abstain, quorum_required, approval_threshold, execution_details, created_at, updated_at, created_by_id, category) FROM stdin;
\.


--
-- Data for Name: settlements; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.settlements (id, booking_id, hotel_asset_id, hotel_wallet, amount, currency, status, tx_hash, created_at, "chainId", "failureReason", "processedAt", stablecoin_address, stablecoin_symbol, retry_count) FROM stdin;
b0222720-472b-47af-a8cc-6fd6e115850a	6f604da9-6647-413a-bbae-b58626da3cd0	3aaeb448-d8d9-4f6a-87bd-09a1e9692414	0x09b5657527A5247807ff357814440355f485854A	0.70	USDC	PENDING	\N	2026-06-06 16:51:52.992	84532	\N	\N	0x036CbD53842c5426634e7929541eC2318f3dCF7e	USDC	0
8dd2cb9d-1146-4196-a488-f295e0e9f097	8425b80c-b74e-4d8d-aaaa-dfe3289b503e	e61c8a59-6486-4ae3-a680-a430e4956d59	0x09b5657527A5247807ff357814440355f485854A	1.05	USDC	PENDING	\N	2026-06-06 17:44:09.177	84532	\N	\N	0x036CbD53842c5426634e7929541eC2318f3dCF7e	USDC	0
5d6a8642-0051-4d78-b3ca-75b76f5340e0	02f72502-f23f-428b-900f-a7b4e9ec8fad	31f98998-86bf-470e-97bd-d4e9df11a658	0x09b5657527A5247807ff357814440355f485854A	0.35	USDC	PENDING	\N	2026-06-07 04:55:05.349	84532	\N	\N	0x036CbD53842c5426634e7929541eC2318f3dCF7e	USDC	0
\.


--
-- Data for Name: staking; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.staking (id, user_id, staked_amount, lock_period_days, stake_start_date, stake_end_date, apy_rate, earned_rewards, claimed_rewards, voting_power_multiplier, status, created_at, updated_at, created_by_id, is_sample) FROM stdin;
\.


--
-- Data for Name: treasury; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.treasury (id, "hotelAssetId", amount, type, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.users (id, email, password, first_name, last_name, phone, role, is_email_verified, email_verified_at, kyc_status, kyc_submitted_at, kyc_approved_at, wallet_address, created_at, updated_at, kyc_expires_at, verification_level, "verificationExpires", "verificationToken", "resetPasswordExpires", "resetPasswordToken", kyc_blockchain_synced, kyc_blockchain_tx_hash, kyc_last_verified, kyc_sync_attempts, kyc_sync_error, "kycDocumentHash") FROM stdin;
85b6e6b2-b96e-4a40-8d2a-95fa16d32159	adonikadjo@hotmail.com	$2b$10$2ggPOP5Tr9WD.QGdVq/WY.nDB1nRGdU7/CmZhLzpvhL6qfd42.dBC	adoni	mathias	\N	USER	t	2026-03-05 12:39:21.964	APPROVED	2026-03-05 18:17:30.424	2026-03-05 18:18:30.61	0x09b5657527A5247807ff357814440355f485854A	2026-03-05 12:38:12.669	2026-03-20 16:48:08.178	\N	\N	\N	\N	\N	\N	t	\N	\N	0	\N	\N
f9818c85-317c-4526-bfca-22798d612748	adonimathias53@gmail.com	$2b$10$fW3/zMPb9Tsfvv3sCuY4dOv/IXqwk46PCodcouQXD6u689hztHJ6q	DENG	Dean	\N	USER	t	2026-03-10 07:22:51.719	APPROVED	2026-03-10 13:57:58.785	2026-03-11 19:50:14.268	0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb	2026-03-10 07:22:21.471	2026-05-25 06:59:20.291	\N	\N	\N	\N	\N	\N	t	\N	\N	0	\N	\N
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.votes (id, proposal_id, user_id, choice, voting_power, comment, created_at) FROM stdin;
\.


--
-- Data for Name: yield_distributions; Type: TABLE DATA; Schema: public; Owner: digiuser
--

COPY public.yield_distributions (id, booking_id, hotel_asset_id, total_amount, distribution_date, created_at, updated_at, distributed_by, stablecoin_symbol, status, tx_hash) FROM stdin;
c05b63c2-d303-40fc-aca1-146b6814f6bf	6f604da9-6647-413a-bbae-b58626da3cd0	3aaeb448-d8d9-4f6a-87bd-09a1e9692414	0.20000000	2026-06-06 16:51:52.981	2026-06-06 16:51:52.981	2026-06-06 16:51:52.981	\N	\N	PENDING	\N
533ad8bb-8bf1-4488-a546-3cc21ce941ec	8425b80c-b74e-4d8d-aaaa-dfe3289b503e	e61c8a59-6486-4ae3-a680-a430e4956d59	0.30000000	2026-06-06 17:44:09.164	2026-06-06 17:44:09.164	2026-06-06 17:44:09.164	\N	\N	PENDING	\N
976ec22f-ca79-4583-811c-049be3ac74ab	02f72502-f23f-428b-900f-a7b4e9ec8fad	31f98998-86bf-470e-97bd-d4e9df11a658	0.10000000	2026-06-07 04:55:05.306	2026-06-07 04:55:05.306	2026-06-07 04:55:05.306	\N	\N	PENDING	\N
\.


--
-- Name: EsgReward EsgReward_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public."EsgReward"
    ADD CONSTRAINT "EsgReward_pkey" PRIMARY KEY (id);


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
-- Name: investor_yields investor_yields_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT investor_yields_pkey PRIMARY KEY (id);


--
-- Name: kyc kyc_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.kyc
    ADD CONSTRAINT kyc_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: settlements settlements_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT settlements_pkey PRIMARY KEY (id);


--
-- Name: staking staking_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.staking
    ADD CONSTRAINT staking_pkey PRIMARY KEY (id);


--
-- Name: treasury treasury_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.treasury
    ADD CONSTRAINT treasury_pkey PRIMARY KEY (id);


--
-- Name: hotel_assets unique_token_address; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.hotel_assets
    ADD CONSTRAINT unique_token_address UNIQUE (token_address);


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
-- Name: yield_distributions yield_distributions_pkey; Type: CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT yield_distributions_pkey PRIMARY KEY (id);


--
-- Name: bookings_booking_code_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX bookings_booking_code_key ON public.bookings USING btree (booking_code);


--
-- Name: bookings_hotel_asset_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_hotel_asset_id_idx ON public.bookings USING btree (hotel_asset_id);


--
-- Name: bookings_qloOrderId_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX "bookings_qloOrderId_key" ON public.bookings USING btree ("qloOrderId");


--
-- Name: bookings_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_status_idx ON public.bookings USING btree (status);


--
-- Name: bookings_user_id_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX bookings_user_id_idx ON public.bookings USING btree (user_id);


--
-- Name: hotel_assets_blockchain_id_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX hotel_assets_blockchain_id_key ON public.hotel_assets USING btree (blockchain_id);


--
-- Name: hotel_assets_tokenId_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX "hotel_assets_tokenId_key" ON public.hotel_assets USING btree ("tokenId");


--
-- Name: investments_blockchainStatus_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX "investments_blockchainStatus_idx" ON public.investments USING btree ("blockchainStatus");


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
-- Name: users_kyc_blockchain_synced_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX users_kyc_blockchain_synced_idx ON public.users USING btree (kyc_blockchain_synced);


--
-- Name: users_kyc_status_idx; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE INDEX users_kyc_status_idx ON public.users USING btree (kyc_status);


--
-- Name: users_verificationToken_key; Type: INDEX; Schema: public; Owner: digiuser
--

CREATE UNIQUE INDEX "users_verificationToken_key" ON public.users USING btree ("verificationToken");


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
-- Name: investor_yields fk_investment_optional; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investment_optional FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON DELETE SET NULL;


--
-- Name: investor_yields fk_investor_user; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investor_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: investor_yields fk_investor_yield_distribution; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.investor_yields
    ADD CONSTRAINT fk_investor_yield_distribution FOREIGN KEY (yield_distribution_id) REFERENCES public.yield_distributions(id) ON DELETE CASCADE;


--
-- Name: settlements fk_settlement_booking; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT fk_settlement_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: settlements fk_settlement_hotel; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.settlements
    ADD CONSTRAINT fk_settlement_hotel FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON DELETE CASCADE;


--
-- Name: yield_distributions fk_yield_asset; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT fk_yield_asset FOREIGN KEY (hotel_asset_id) REFERENCES public.hotel_assets(id) ON DELETE CASCADE;


--
-- Name: yield_distributions fk_yield_booking; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.yield_distributions
    ADD CONSTRAINT fk_yield_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


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
-- Name: payment payment_booking_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_booking_fkey FOREIGN KEY ("bookingId") REFERENCES public.bookings(id) ON DELETE CASCADE;


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
-- Name: treasury treasury_hotelAssetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: digiuser
--

ALTER TABLE ONLY public.treasury
    ADD CONSTRAINT "treasury_hotelAssetId_fkey" FOREIGN KEY ("hotelAssetId") REFERENCES public.hotel_assets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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

\unrestrict agZRoUvE1061gdUe3YvbshdVkZnUcJifbfQfeL0G6DyBFpMiQWt6S83lUUGa3EL

