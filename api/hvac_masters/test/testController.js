import Test from "./testModel";

export default {
  save: function(req, res) {
    var test = new Test({
      name: req.body.name
    })
     test.save().then(function(docs) {
      res.send({data: docs});
    })
  }
}