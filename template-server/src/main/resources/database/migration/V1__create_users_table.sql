CREATE TABLE "user" (
    id      UUID         NOT NULL,
    name    VARCHAR(255) NOT NULL,
    role    VARCHAR(50)  NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);
