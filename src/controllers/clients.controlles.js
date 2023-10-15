import { pool } from "../db.js";

export const getClients = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clients");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM clients WHERE phone = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Cliente no encontrado :(" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM clients WHERE phone = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Cliente no encontrado :(" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};

export const createClient = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address } = req.body;
    // Verificar que los campos no esten vacios
    if (!first_name || !last_name || !email || !phone || !address) {
      return res
        .status(400)
        .json({ message: "Por favor ingrese todos los campos: first_name, last_name, email, phone, address" });
    }
    // Verificar que el telefono tenga 9 digitos
    if (phone.length !== 9) {
      return res
        .status(400)
        .json({ message: "El telefono debe tener 9 digitos" });
    }
    // Verificar si el cliente ya existe
    const [clt_test] = await pool.query("SELECT * FROM clients WHERE phone = ?", [
      phone,
    ]);
    if (clt_test.length > 0) {
      return res.status(400).json({ message: "El cliente ya existe" });
    }
    // Crear el nuevo cliente
    const [rows] = await pool.query(
      "INSERT INTO clients (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, address]
    );
    res.status(201).json({ id: rows.insertId, ...req.body });
  } catch (error) {
    return res.status(500).json({ message: "Algo salio mal" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address } = req.body;

    const [result] = await pool.query(
      "UPDATE clients SET first_name = IFNULL(?, first_name), last_name = IFNULL(?, last_name), phone = IFNULL(?, phone), email = IFNULL(?, email), position = IFNULL(?, position), salary = IFNULL(?, salary) WHERE id = ?",
      [first_name, last_name, phone, email, address, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });

    const [rows] = await pool.query("SELECT * FROM clients WHERE phone = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Upss... algo salio mal" });
  }
};
