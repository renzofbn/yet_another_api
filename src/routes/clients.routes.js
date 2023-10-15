import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  updateClient,
} from "../controllers/clients.controlles.js";

const router = Router();

router.get("/clients", getClients);

router.get("/clients/:id", getClient);

router.delete("/clients/:id", deleteClient);

router.post("/clients", createClient);

router.patch("/clients/:id", updateClient);

export default router;
