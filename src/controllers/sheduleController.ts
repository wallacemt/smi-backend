import { Router, Request, Response } from "express";
import { SchedulePostService } from "../services/shedulePostService";
import AuthPolice from "../middleware/authPolice";
import errorFilter from "../utils/isCustomError";
import { ScheduledPostRequest } from "../types/posts";

export class SchedulePostController {
  public router: Router;
  private scheduleService = new SchedulePostService();

  constructor() {
    this.router = Router();
    this.sheduleRoutes();
  }

  private sheduleRoutes() {
    this.router.use(AuthPolice);
    this.router.get("/", this.getAllScheduledPosts.bind(this));
    this.router.post("/", this.createScheduledPost.bind(this));
    this.router.get("/:id", this.getScheduledPostById.bind(this));
  }

  private async getAllScheduledPosts(req: Request, res: Response) {
    const scheduledPosts = await this.scheduleService.getAllScheduledPosts();
    res.status(200).json(scheduledPosts);
  }

  private async createScheduledPost(req: Request, res: Response) {
    try {
      const data: ScheduledPostRequest = {
        date: new Date(req.body.date),
        time: req.body.time,
        postId: req.body.postId,
        status: "scheduled",
      };
      const scheduledPost = await this.scheduleService.createScheduledPost(data);
      res.status(201).json(scheduledPost);
    } catch (err) {
      errorFilter(err, res);
    }
  }

  private async getScheduledPostById(req: Request, res: Response) {
    try {
      const scheduledPost = await this.scheduleService.getScheduledPostById(req.params.id);
      res.status(200).json(scheduledPost);
    } catch (err) {
      errorFilter(err, res);
    }
  }
}
