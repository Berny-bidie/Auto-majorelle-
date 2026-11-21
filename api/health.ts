export default function health(_req: any, res: any) {
  res.status(200).json({ status: "ok" });
}
