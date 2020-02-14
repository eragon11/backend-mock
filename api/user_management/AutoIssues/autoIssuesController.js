import autoIssue from './autoIssuesModel';
var moment = require('moment');
const AutoIssueController = {};

// common success and error response...
AutoIssueController.successmsg = async (res, autoIssueData, msg) => {
  res.status(200).send({
    code: 200,
    message: msg,
    autoIssueData
  })
}

AutoIssueController.errormsg = async (res, msg) => {
  res.status(400).send({
    code: 400,
    message: msg,
    autoIssueData: []
  })
}

//autoIssue find all records
AutoIssueController.findAll = async (req, res) => {

  try {

    const autoIssueall = await autoIssue.find({ 'Issues_IsDeleted_bool': false });
    console.log(autoIssueall);

    AutoIssueController.successmsg(res, autoIssueall, 'found All Successfully')

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error);
  }
}


//autoIssue save 
AutoIssueController.insert = async (req, res) => {

  try {
    let AutoIssueObj = new autoIssue({
      Issues_Ticket_Num: req.body.ticket,
      Issues_Fk_User_Id_object: req.body.user_id,
      Issues_Description_Str: req.body.description,
      Issues_Device_ID_Str: req.body.deviceId,
      Issues_Raised_date: req.body.raisedDate,
      Issues_Priority_int: req.body.priority,
      Issues_Status_Str: req.body.status,
      // Issues_CreatedbyId_obj: req.body.createdById,
      // Issues_ModifiedbyId_obj: req.body.modifiedById,
      // Issues_CreatedIP_str: req.body.createdIP,
      // Issues_ModifiedIP_str: req.body.modifiedIP,
    });


    const autoIssueinsert = await AutoIssueObj.save();

    AutoIssueController.successmsg(res, autoIssueinsert, 'saved successfully')

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error);
  }
}

//autoIssue update all
AutoIssueController.update = async (req, res) => {
  try {

    let autoIssue_id = req.params.id

    let AutoIssueObj = {
      Issues_Ticket_Num: req.body.ticket,
      Issues_Fk_User_Id_object: req.body.user_id,
      Issues_Description_Str: req.body.description,
      Issues_Device_ID_Str: req.body.deviceId,
      Issues_Raised_date: req.body.raisedDate,
      Issues_Priority_int: req.body.priority,
      Issues_Status_Str: req.body.status,
      // Issues_CreatedbyId_obj: req.body.createdById,
      // Issues_ModifiedbyId_obj: req.body.modifiedById,
      // Issues_CreatedIP_str: req.body.createdIP,
      // Issues_ModifiedIP_str: req.body.modifiedIP,
    };

    const autoIssueupdate = await autoIssue.findByIdAndUpdate(autoIssue_id, AutoIssueObj, { new: true });

    AutoIssueController.successmsg(res, autoIssueupdate, 'updated successfully')

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error);
  }
}

//autoIssue find single record
AutoIssueController.find = async (req, res) => {
  try {
    let autoIssue_id = req.params.id;
    console.log(autoIssue_id);

    const autoIssueOne = await autoIssue.findOne({ '_id': autoIssue_id, 'Issues_IsDeleted_bool': false });

    AutoIssueController.successmsg(res, autoIssueOne, "found By Id Successfully");

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error);
  }
}


//autoIssue delete soft
AutoIssueController.delete = async (req, res) => {
  try {

    let autoIssue_id = req.params.id;

    let autoIssueObj = {
      Issues_IsDeleted_bool: true
    }
    console.log(autoIssueObj);

    const soft_delete_autoIssue = await autoIssue.findByIdAndUpdate(autoIssue_id, autoIssueObj, { new: true });

    AutoIssueController.successmsg(res, soft_delete_autoIssue, "Deleted Successfully")

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error)
  }
}


//autoComplaint 
AutoIssueController.findAutoComplaint = async (req, res) => {
  try {
    let startDate;
    let endDate;
    let dateRange;
    let status = req.query.status;
    let sortBy = req.query.sortBy;
    console.log(status, sortBy);

    if (sortBy == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "Issues_Created_Date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };
    } else if (sortBy == "Week") {
      console.log("else");

      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      dateRange = { "Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
    } else if (sortBy == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      dateRange = { "Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      dateRange = { "Issues_Created_Date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
    }

    console.log(dateRange);

    let issueData = await autoIssue.find({ "$and": [{ "Issues_Status_Str": status }, dateRange] }).sort({ "Issues_Created_Date": -1 }).populate('Issues_Fk_User_Id_object')

    AutoIssueController.successmsg(res, issueData, "Successfully")

  } catch (error) {
    console.log(error);
    AutoIssueController.errormsg(res, error)
  }
}


export default AutoIssueController;