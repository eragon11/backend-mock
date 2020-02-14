
import zoneTempTransaction from '../../../hvac_transaction/zoneTemprature/zoneTempratureModel';
import zoneTempMaster from '../../../hvac_masters/zoneTemprature/zoneTempratureModel';
var moment = require('moment');
import * as _ from 'lodash';
let ObjectID = require("mongoose").Types.ObjectId;

let zoneTemperatureController = {};

zoneTemperatureController.zone = async (req, res) => {
  try {

    let locationId = req.params.locationId || "5d788965545440369c4964ce";
    let siteId = req.params.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.params.buildingId || "5d788a42545440369c4964d3";

    let deviceZoneMapDocs = await zoneTempMaster.aggregate(
      [
        {
          "$match": {
            "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
            { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
            { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }, { "ZNTM_IsActive_Bool": true }]
          }
        },
        {
          "$lookup": {
            "from": "zonetempraturetransactions",
            "localField": "_id",
            "foreignField": "ZNTTS_Fk_ZoneDeviceId_Obj",
            "as": "RightTableData"
          }
        },
        {
          "$unwind": {
            "path": "$RightTableData"
          }
        },
        {
          "$group": {
            "_id": "$RightTableData.ZNTTS_Fk_ZoneDeviceId_Obj",
            "righttabledata": { "$last": "$$ROOT" }
          }
        },
        {
          "$sort": {
            "righttabledata.RightTableData.ZNTTS_Created_date": 1.0
          }
        },
        {
          "$project": {
            "Temperature": "$righttabledata.RightTableData.ZNTTS_Temperature_Num",
            "TemperatureUp": "$righttabledata.ZNTM_TemperatureUpp_Num",
            "TemperatureLow": "$righttabledata.ZNTM_TemperatureLow_Num",
            "Humidity": "$righttabledata.RightTableData.ZNTTS_Humidity_Num",
            "HumidityUp": "$righttabledata.ZNTM_HumidityUpp_Num", 
            "HumidityLow": "$righttabledata.ZNTM_HumidityLow_Num",
            "createdDate": { "$dateToString": { "format": "%Y-%m-%d", "date": "$righttabledata.RightTableData.ZNTTS_Created_date" } },
            "deviceId": "$righttabledata.RightTableData.ZNTTS_IoModuleID_str",
            "deviceName": "$righttabledata.ZNTM_Device_Name_Str",
            "createdTime": {
              "$substr": [
                "$righttabledata.RightTableData.ZNTTS_Created_date",
                11.0,
                8.0
              ]
            },
            "ZNTM_Fk_ZM_ZoneID_Obj": "$righttabledata.ZNTM_Fk_ZM_ZoneID_Obj",
            "status": {
              "$cond": {
                "if": {
                  "$and": [
                    {
                      "$gt": [
                        "$righttabledata.RightTableData.ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureLow_Num"
                      ]
                    },
                    {
                      "$lt": [
                        "$righttabledata.RightTableData.ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureUpp_Num"
                      ]
                    }
                  ]
                },
                "then": "Normal",
                "else": {
                  "$cond": {
                    "if": {
                      "$lt": [
                        "$righttabledata.RightTableData.ZNTTS_Temperature_Num",
                        "$righttabledata.ZNTM_TemperatureLow_Num"
                      ]
                    },
                    "then": "Low",
                    "else": "High"
                  }
                }
              }
            }
          }
        }
      ], function (err, docs) {
        console.log("docs");

        console.log(docs);
        var options = {
          path: 'ZNTM_Fk_ZM_ZoneID_Obj',
          model: 'zone'
        };
        zoneTempMaster.populate(docs, options, function (err, projects) {
          console.log("inner master");
          console.log(projects);

          let chars = _.orderBy(projects, '_id', 'asc');

          res.status(200).send({
            code: 200,
            message: "success",
            data: chars
          });
        })
      })

  } catch (error) {
    console.log(error);
  }
}

zoneTemperatureController.zoneGraph = async (req, res) => {
  try {

    let startDate, endDate;
    let dateRange;
    let dateGroupString;
    let group_id;

    let locationId = req.body.locationId || "5d788965545440369c4964ce";
    let siteId = req.body.siteId || "5d7889af545440369c4964d0";
    let buildingId = req.body.buildingId || "5d788a42545440369c4964d3";

    let today = false;
    if (req.body.sortType == "Today") {
      startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      group_id = { "$hour": "$RightTableData.ZNTTS_Created_date" }
      today = true;
      dateRange = { "RightTableData.ZNTTS_Created_date": { "$gte": new Date(moment().utc().subtract(12, 'h')), "$lte": new Date(moment().utc()) } };

      dateGroupString = { "format": "%H", "date": "$RightTableData.ZNTTS_Created_date" };
    } else if (req.body.sortType == "Week") {
      startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
      group_id = { 'ZNTTS_IoModuleID_str': "$ZNTTS_IoModuleID_str", "day": { "$dayOfMonth": "$RightTableData.ZNTTS_Created_date" } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ZNTTS_Created_date" };
      dateRange = { "RightTableData.ZNTTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }

    } else if (req.body.sortType == "Month") {
      startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      endDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "RightTableData.ZNTTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ZNTTS_Created_date" };
    } else {
      startDate = moment(req.body.fromDate + 'T00:00:00.000Z');
      endDate = moment(req.body.toDate + 'T23:59:59.000Z');
      group_id = "$ZNTTS_IoModuleID_str"
      dateRange = { "RightTableData.ZNTTS_Created_date": { "$gte": new Date(startDate), "$lte": new Date(endDate) } }
      if (req.body.fromDate == req.body.toDate) {
        today = true;
        dateGroupString = { "format": "%H", "date": "$RightTableData.ZNTTS_Created_date" };
      } else {
        dateGroupString = { "format": "%Y-%m-%d", "date": "$RightTableData.ZNTTS_Created_date" };
      }
    }
    let match = {
      "$match": {
        "$and": [
          {
            "RightTableData.ZNTTS_IoModuleID_str": { $in: req.body.selectValue }
          }, dateRange
        ]
      }
    };
    let group = {
      "$group": {
        "_id": {
          "date": {
            "$dateToString": dateGroupString
          },
          "ZNTTS_IoModuleID_str": "$RightTableData.ZNTTS_IoModuleID_str"
        },
        "ZNTTS_IoModuleID_str": {
          "$last": "$RightTableData.ZNTTS_IoModuleID_str"
        },
        "ZNTTS_Created_date": {
          "$last": "$RightTableData.ZNTTS_Created_date"
        },
        "ZNTTS_Humidity_Num": {
          "$avg": "$RightTableData.ZNTTS_Humidity_Num"
        },
        "ZNTTS_Temperature_Num": {
          "$avg": "$RightTableData.ZNTTS_Temperature_Num"
        }
      }
    };
    let pipeline = [
      {
        "$match": {
          "$and": [{ "ZNTM_Fk_LM_LocationID_Obj": ObjectID(locationId) },
          { "ZNTM_Fk_SM_SiteID_Obj": ObjectID(siteId) },
          { "ZNTM_Fk_BM_BuildingID_Obj": ObjectID(buildingId) }]
        }
      },
      {
        "$lookup": {
          "from": "zonetempraturetransactions",
          "localField": "_id",
          "foreignField": "ZNTTS_Fk_ZoneDeviceId_Obj",
          "as": "RightTableData"
        }
      },
      {
        "$unwind": {
          "path": "$RightTableData"
        }
      },
      {
        "$sort": {
          "ZNTTS_Created_date": -1.0
        }
      },
      {
        "$project": {
          "Temperature": "$ZNTTS_Temperature_Num",
          "Humidity": "$ZNTTS_Humidity_Num",
          "deviceId": "$ZNTTS_IoModuleID_str",
          "createdDate": {
            "$dateToString": {
              "format": "%Y-%m-%d",
              "date": "$ZNTTS_Created_date"
            }
          },
          "createdTime": {
            "$substr": [
              "$ZNTTS_Created_date",
              11.0,
              8.0
            ]
          },
          "id": "$_id.ZNTTS_IoModuleID_str",
          "deviceName": "$rightabledata.ZNTM_Device_Name_Str"
        }
      }
    ];

    pipeline.splice(3, 0, match, group);

    let deviceZoneMapDocs = await zoneTempMaster.aggregate(pipeline);
    const outJSON = {};
    if (req.body.sortType == "Today") {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }
        const diLen = outJSON[di].length;
        if ((diLen > 0) || diLen == 0) {
          outJSON[di].push(deviceZoneMapDocs[i]);
        }
      }
    } else {
      for (let i = 0, len = deviceZoneMapDocs.length; i < len; i++) {
        const di = deviceZoneMapDocs[i]['deviceId'];
        if (!outJSON[di]) {
          outJSON[di] = []
        }

        outJSON[di].push(deviceZoneMapDocs[i]);
      }
    }

    res.status(200).send({
      code: 200,
      message: "success",
      data: outJSON
    });
  } catch (error) {
    console.log(error);
  }
}

export default zoneTemperatureController;