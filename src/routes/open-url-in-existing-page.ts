import { Router } from "express";
import { getPage } from "@managers/browser-manager";
import { generatePdf, deletePdf } from "@utils/pdf-utils";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { pageId, url } = req.body;
    const page = getPage(pageId);

    console.log('open-url-in-existing-page, pageId=' + pageId);
    if (!page) return res.status(400).send("Page not found");

    deletePdf(pageId);
    await generatePdf(page, pageId);

    const response = await page.goto(url);

    return res.send({ response: response?.status() });
  } catch (error) {
    const response = "Error while opening url tab. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
