import Comment from "../data/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (!content || !postId || !userId) {
      return next({
        status: 400,
        message: "All fields are require!",
      });
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    return res.status(200).json(newComment);
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(comments);
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
export const likeComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next({
        status: e404,
        message: "Comment not found!",
      });
    }
    const userIndex = comment.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user._id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
export const editComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next({
        status: 404,
        message: "Comment not found!",
      });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next({
        status: 403,
        message: "You are not allowed to edit this comment!",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
export const deleteComments = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next({
        status: 404,
        message: "Comment not found!",
      });
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next({
        status: 403,
        message: "You are not allowed to delete this comment!",
      });
    }
    await Comment.findByIdAndDelete(req.params.commentId);

    return res.status(200).json("Comment has been deleted!");
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next({
      status: 403,
      message: "You are not allowed to delete this comment!",
    });
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};
