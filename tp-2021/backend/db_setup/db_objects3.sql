DROP TABLE IF EXISTS crypto_prediction;

CREATE TABLE crypto_prediction (
    id serial PRIMARY KEY,
    crypto_type_id int,
    time_period_start timestamp NOT NULL,
    predicted_price_close real,
    constraint fk_crypto_type_id foreign key (crypto_type_id) REFERENCES crypto_type(id)
);
