DROP TABLE IF EXISTS new_crypto;
DROP TABLE IF EXISTS app_user cascade ;
DROP TABLE IF EXISTS user_crypto cascade ;

CREATE TABLE new_crypto (
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


CREATE TABLE app_user (
    id serial PRIMARY KEY,
    name varchar (255) NOT NULL,
    surname varchar (255) NOT NULL,
    email varchar (255) NOT NULL,
    hashed_password varchar (255) NOT NULL
);

CREATE TABLE user_crypto (
    user_id int NOT NULL,
    crypto_type_id  int NOT NULL,
    count float,
    PRIMARY KEY (user_id, crypto_type_id),
    constraint fk_user_id foreign key (user_id) REFERENCES app_user(id),
    constraint fk_crypto_type_id foreign key (crypto_type_id) REFERENCES crypto_type(id)
);
