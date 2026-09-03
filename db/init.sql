CREATE TABLE IF NOT EXISTS porting_request (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number        VARCHAR(11)  NOT NULL,
    recipient_operator  VARCHAR(20)  NOT NULL,
    donor_operator      VARCHAR(20)  NOT NULL,
    status              VARCHAR(20)  NOT NULL,
    created_at          DATETIME     NOT NULL,
    updated_at          DATETIME     NOT NULL
);

CREATE INDEX idx_porting_request_phone_status ON porting_request (phone_number, status);
