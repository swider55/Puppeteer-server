import { Router } from "express";
import { generateRandomId } from "@utils/uuid-utils";
import { getBrowser, setNewPage } from "@managers/browser-manager";
import { generatePdf } from "@utils/pdf-utils";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;
    const pageId = generateRandomId();
    const browser = getBrowser();

    console.log('open-url-in-new-page');
    if (!browser) return res.status(400).send("Browser not started");

    const page = await browser.newPage();

    await page.goto(url);

    setNewPage(pageId, page);
    await generatePdf(page, pageId);

    return res.send({ pageId: pageId });
  } catch (error) {
    const response = "Error while opening url in new tab. ";
    console.error(response + error);
    return res.status(500).send(response);
  }
});

export default router;
