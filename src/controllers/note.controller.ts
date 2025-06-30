import { Request, Response } from "express";
import * as NoteServices from '../services/note.service';
import { sendSuccess } from "../utils/api-responses";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const addNote = async (req:AuthenticatedRequest, res:Response) => {
    const response = await NoteServices.addNote(req);

    return res.status(201).json(sendSuccess('Note Added Successfully', response))
}

export const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
    const response = await NoteServices.getAllNotes(req);

    return res.status(200).json(sendSuccess('All Notes Retrieved Successfully', response))
}

export const viewNote = async (req: AuthenticatedRequest, res: Response) => {
    const response = await NoteServices.viewNote(req);

    return res.status(200).json(sendSuccess('Note Retrieved Successfully', response))
}

export const editNote = async (req: AuthenticatedRequest, res: Response) => {
    const response = await NoteServices.editNote(req);

    return res.status(200).json(sendSuccess('Note edited Successfully', response))
}

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    const response = await NoteServices.deleteNote(req);

    return res.status(200).json(sendSuccess('Note deleted Successfully', response))
}


