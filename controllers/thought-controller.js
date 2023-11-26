const { Thought, User } = require('../models')

const thoughtController = {

  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
      path: "reactions",
      select: "__v",
    })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.statusStatus(400)
      });
  },
  
  // GET thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
      path: "reactions",
      select: "-__v",
    })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No id found for this thought" });
          return;
        }
        res.json(dbThoughtData);
      })
      .cath((err) => {
        console.log(err);
        res.status(400);
      });
  },
  
  // POST thought
  createThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
        return res.status(404).json({ message: "No id found for this user" });
        
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  
  // PUT update thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
        return res.status(404).json({ message: "No id found for this thought" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: "No id found for this thought" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.Id } },
          { new: true }
        )
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No id found for this user" });
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  
  // POST reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true })

      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No id found for this thought" });
        }
        res.json(dbThoughtData);
      })
    .catch(err => res.status(400).json(err))
  },

  // DELETE reaction
  deleteReaction({ params }, res) { 
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
  )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No id found for this thought" });
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  }
};

module.exports = thoughtController;