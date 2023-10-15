USE mi_empresa;

DELIMITER $$

CREATE PROCEDURE `employeeAddOrEdit` (
  IN _id INT,
  IN _first_name VARCHAR(45),
  IN _last_name VARCHAR(45),
  IN _dni VARCHAR(8),
  IN _phone VARCHAR(15),
  IN _email VARCHAR(100),
  IN _position VARCHAR(45),
  IN _hire_date DATE,
  IN _salary INT
)
BEGIN
  IF _id = 0 THEN
    INSERT INTO employee (first_name, last_name, dni, phone, email, position, hire_date, salary)
    VALUES (_first_name, _last_name, _dni, _phone, _email, _position, _hire_date, _salary);

    SET _id = LAST_INSERT_ID();
  ELSE
    UPDATE employee
    SET
      first_name = _first_name,
      last_name = _last_name,
      dni = _dni,
      phone = _phone,
      email = _email,
      position = _position,
      hire_date = _hire_date,
      salary = _salary
    WHERE id = _id;
  END IF;

  SELECT _id AS 'id';
END$$

CREATE PROCEDURE `clientAddOrEdit` (
  IN _id INT,
  IN _first_name VARCHAR(45),
  IN _last_name VARCHAR(45),
  IN _email VARCHAR(100),
  IN _phone VARCHAR(15),
  IN _address VARCHAR(255),
  IN _registration_date DATE
)
BEGIN
  IF _id = 0 THEN
    INSERT INTO clients (first_name, last_name, email, phone, address, registration_date)
    VALUES (_first_name, _last_name, _email, _phone, _address, _registration_date);

    SET _id = LAST_INSERT_ID();
  ELSE
    UPDATE clients
    SET
      first_name = _first_name,
      last_name = _last_name,
      email = _email,
      phone = _phone,
      address = _address,
      registration_date = _registration_date
    WHERE id = _id;
  END IF;

  SELECT _id AS 'id';
END$$

DELIMITER ;
