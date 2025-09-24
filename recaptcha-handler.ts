import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;

  const response = await fetch(verifyUrl, { method: "POST" });
  const data = await response.json();

  if (data.success && data.score > 0.5) {
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, error: data });
}
