CREATE TABLE products (
	product_id serial PRIMARY KEY,
	name text NOT NULL UNIQUE,
	price numeric NOT NULL,
	quantity integer NOT NULL,
	CHECK (price >= 0),
	CHECK (quantity >= 0)
);

CREATE TABLE orders (
	order_id serial PRIMARY KEY,
	order_date date NOT NULL DEFAULT CURRENT_DATE -- talvez mudar para timestamp
);

CREATE TABLE orders_products (
	order_id integer REFERENCES orders (order_id) ON UPDATE CASCADE ON DELETE CASCADE,
	product_id integer REFERENCES products (product_id) ON UPDATE CASCADE,
	amount integer NOT NULL,
	CONSTRAINT order_product_pkey PRIMARY KEY (order_id, product_id)
);
