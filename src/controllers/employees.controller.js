import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM employee WHERE dni = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Empleado no encontrado :(" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM employee WHERE dni = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Empleado no encontrado :(" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, dni, phone, email, position, salary } = req.body;
    // Verificar que los campos no esten vacios
    if (!first_name || !last_name || !dni || !phone || !email || !position || !salary) {
      return res
        .status(400)
        .json({ message: "Por favor ingrese todos los campos: first_name, last_name, dni, phone, email, position, salary" });
    }
    // Verificar que el dni tenga 8 digitos
    if (dni.length !== 8) {
      return res
        .status(400)
        .json({ message: "El dni debe tener 8 digitos" });
    }
    // Verificar que el salario sea mayor a 0
    if (salary <= 0) {
      return res
        .status(400)
        .json({ message: "El salario debe ser mayor a 0" });
    }
    // Verificar el telefono tenga 9 digitos
    if (phone.length !== 9) {
      return res
        .status(400)
        .json({ message: "El telefono debe tener 9 digitos" });
    }
    // Verificar si el empleado ya existe
    const [epm_test] = await pool.query("SELECT * FROM employee WHERE dni = ?", [
      dni,
    ]);
    if (epm_test.length > 0) {
      return res
        .status(400)
        .json({ message: "El empleado ya existe en la base de datos" });
    }
    // Insertar empleado
    const [rows] = await pool.query(
      "INSERT INTO employee (first_name, last_name, dni, phone, email, position, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, dni, phone, email, position, salary]
    );
    res.status(201).json({ id: rows.insertId, ...req.body });
  } catch (error) {
    return res.status(500).json({ message: "Algo salio mal :(" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email, position, salary } = req.body;

    const [result] = await pool.query(
      "UPDATE employee SET first_name = IFNULL(?, first_name), last_name = IFNULL(?, last_name), phone = IFNULL(?, phone), email = IFNULL(?, email), position = IFNULL(?, position), salary = IFNULL(?, salary) WHERE dni = ?",
      [first_name, last_name, phone, email, position, salary, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Empleado no encontrado" });

    const [rows] = await pool.query("SELECT * FROM employee WHERE dni = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};
