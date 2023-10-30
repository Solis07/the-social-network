const router = require('express').Router();
const { getAllThoughts, getThoughtById, createThought, updateThought, deleteThought, addReaction, deleteReaction } = require('../../controllers/thought-controller');

router.route("/").get(getAllThoughts);

router.route("/:userId").post(createThought);

router.route("/:thoughtId").get(getThoughtById).put(updateThought);

router.route("/:userId/:thoughtId").delete(deleteThought);

router.route("/:thoughtId/:reactions").post(addReaction);

router.route("/:thoughtId/:reactions/:reactionId").delete(deleteReaction);

module.exports = router;


