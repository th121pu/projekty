DROP TABLE IF EXISTS crypto;
DROP TABLE IF EXISTS crypto_type;

CREATE TABLE crypto_type (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    code bpchar(100) NOT NULL
);

INSERT INTO crypto_type (name, code) VALUES ('bitcoin', 'BTC');

CREATE TABLE crypto (
    id serial PRIMARY KEY,
    time_period_start timestamp NOT NULL,
    time_period_end timestamp NOT NULL,
    time_open timestamp,
    time_close timestamp,
    price_open real,
    price_high real,
    price_low real,
    price_close real,
    volume_traded double precision,
    trades_count int,
    crypto_type_id int,
    constraint fk_crypto_type_id foreign key (crypto_type_id) REFERENCES crypto_type(id)
);
