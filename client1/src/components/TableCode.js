import React from 'react'

const TableCode = () => {
  return (
    <div>
      <h3>this is table code </h3>
      // users table code  

      CREATE TABLE shashank_pathak.users (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	email varchar(100) NOT NULL,
	full_name varchar(100) NULL,
	image varchar(255) NULL,
	"role" varchar(50) NOT NULL,
	approved bool DEFAULT false NULL,
	otp varchar(10) NULL,
	otp_expires_at timestamp NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


// this is product table code 

CREATE TABLE shashank_pathak.products (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	price numeric NULL,
	description text NULL,
	photo varchar(255) NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	category varchar(255) NULL,
	rating int4 DEFAULT 0 NULL,
	rating_count int4 DEFAULT 0 NULL,
	discount varchar(255) NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);


// this is order history table code

CREATE TABLE shashank_pathak.order_history (
	id serial4 NOT NULL,
	order_id int4 NOT NULL,
	user_id int4 NOT NULL,
	quantity int4 NOT NULL,
	status varchar(50) NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	product_id int4 NOT NULL,
	rating numeric(3, 2) NULL,
	CONSTRAINT order_history_pkey PRIMARY KEY (id)
);

// this is contact table code 

CREATE TABLE shashank_pathak.contacts (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	food varchar(255) NULL,
	message text NULL,
	CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
  


// this is cart table code
CREATE TABLE shashank_pathak.cart (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	product_id int4 NOT NULL,
	quantity int4 NOT NULL,
	added_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	delivered bool DEFAULT false NULL,
	CONSTRAINT cart_pkey PRIMARY KEY (id)
);
    </div>
  )
}

export default TableCode
