import express from "express";
import mongoose from "mongoose";
import { Pages, Blocks } from "../model/pages.js";

const pagesRouter = express.Router();

pagesRouter.get("/", async (req, res) => {
  try {
    // await Pages.deleteMany({});
    const pagesList = await Pages.find();
    res.json(pagesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const page = await Pages.findById(id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const pageData = req.body;
    const newPage = new Pages(pageData);
    await newPage.save();
    res.status(200).json({ message: "추가 성공", data: newPage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.patch("/:id", async (req, res) => {
  const articleId = req.params.id;
  const { title } = req.body;

  if (typeof title !== "string") {
    return res.status(400).json({ error: "Title must be a string" });
  }

  try {
    const article = await Pages.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    article.title = title;
    await article.save();

    res.json({ message: "Title updated successfully", article });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.delete("/api/pages", async (req, res) => {
  try {
    const pageData = req.body;
    const newPage = new Pages(pageData);
    await newPage.save();
    res
      .status(200)
      .json({ message: "Page deleted successfully", data: newPage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.post("/:id/block", async (req, res) => {
  const { id: articleId } = req.params;
  const { type, content, children, insertIndex } = req.body;

  try {
    const article = await Pages.findById(articleId);
    const newBlock = { type, content, children };

    if (
      insertIndex !== undefined &&
      insertIndex >= 0 &&
      insertIndex < article.blocklist.length
    ) {
      article.blocklist.splice(insertIndex + 1, 0, newBlock);
    } else {
      article.blocklist.push(newBlock);
    }

    await article.save();
    res
      .status(201)
      .json({ message: "Block added successfully", nextIdx: insertIndex + 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

pagesRouter.patch(
  "/:id/block/:blockId/element/:elementId",
  async (req, res) => {
    const { id: articleId, blockId, elementId } = req.params;
    const { content } = req.body;

    try {
      const page = await Pages.findById(articleId);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      //리팩토링이 필요해 보인다
      let blockFound = false;
      for (let block of page.blocklist) {
        if (block._id.toString() === blockId) {
          let elementFound = false;
          for (let row of block.element) {
            for (let element of row) {
              if (element._id.toString() === elementId) {
                element.content = content;
                elementFound = true;
                break;
              }
            }
            if (elementFound) break;
          }

          if (!elementFound) {
            return res.status(404).json({ message: "Element not found" });
          }

          blockFound = true;
          break;
        }
      }

      if (!blockFound) {
        return res.status(404).json({ message: "Block not found" });
      }

      await page.save();
      res
        .status(200)
        .json({ message: "Element content updated successfully", page });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

pagesRouter.delete("/:id/block/:blockId", async (req, res) => {
  const { id: articleId, blockId } = req.params;

  try {
    const article = await Pages.findById(articleId);
    const block = await Blocks.findById(blockId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default pagesRouter;
