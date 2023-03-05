DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS food CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS school CASCADE;
DROP TABLE IF EXISTS canteen CASCADE;
DROP TABLE IF EXISTS canteen_menu CASCADE;
DROP TABLE IF EXISTS user_object CASCADE;
DROP TABLE IF EXISTS all_orders CASCADE;

CREATE TABLE category (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL
);

CREATE TABLE food (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    category_id int,
    constraint fk_category_id foreign key (category_id) REFERENCES category(id)
);

CREATE TABLE menu (
    id serial PRIMARY KEY,
    date timestamp NOT NULL ,
    price real NOT NULL,
    food_id int,
    constraint fk_food_id foreign key (food_id) REFERENCES food(id)
);

CREATE TABLE school (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    address varchar(100),
    contact varchar(100)
);

CREATE TABLE canteen (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    address varchar(100),
    contact varchar(100),
    opening_hours varchar(100),
    school_id int,
    constraint fk_school_id foreign key (school_id) REFERENCES school(id)
);

CREATE TABLE canteen_menu (
    canteen_id int,
    menu_id int,
    PRIMARY KEY (canteen_id, menu_id),
    constraint fk_canteen_id foreign key (canteen_id) REFERENCES canteen(id),
    constraint fk_menu_id foreign key (menu_id) REFERENCES menu(id)
);

CREATE TABLE user_object (
    id serial PRIMARY KEY,
    azure_id varchar(100) NOT NULL,
    name varchar(100),
    isic varchar(100),
    username varchar(100) NOT NULL,
    alternative_email varchar(100),
    account_balance real,
    school_id int,
    role varchar(20),
    constraint fk_school_id foreign key (school_id) REFERENCES school(id)
);

CREATE TABLE all_orders (
    id serial PRIMARY KEY,
    user_object_id int,
    canteen_id int,
    menu_id int,
    prepaid boolean NOT NULL,
    picked boolean NOT NULL,
    constraint fk_user_object_id foreign key (user_object_id) REFERENCES user_object(id),
    constraint fk_canteen_menu_id FOREIGN KEY (canteen_id, menu_id) REFERENCES canteen_menu (canteen_id, menu_id) MATCH FULL
);
