const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let endTime
  let requestWasSuccessful

  const startTime = timeInMs()
  try{
    await axios.get(url)  
    requestWasSuccessful=true
  }catch(err) {
    requestWasSuccessful=false
  }
  
  endTime = timeInMs()

  await cloudwatch.putMetricData({
     MetricData: [ // A list of data points to sen

    {
       MetricName: 'Success',
    Dimensions: [ // A list of key-value pairs that can be used to filter metrics from CloudWatch
        {
          Name: 'PingName',
          Value: serviceName
        }
      ],
      Unit: 'Count', // Unit of a metric
      Value: requestWasSuccessful?1:0 // Value of a metric to store
    },
    {
    Dimensions: [ // A list of key-value pairs that can be used to filter metrics from CloudWatch
        {
          Name: 'PingTime',
          Value: serviceName
        }
      ],
      Unit: 'Time', // Unit of a metric
      Value: endTime - startTime // Value of a metric to store
    }
  ],
  Namespace: 'Udacity/Serveless'
  }).promise()
  // Example of how to write a single data point
  // await cloudwatch.putMetricData({
  //   MetricData: [
  //     {
  //       MetricName: 'MetricName', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
  //       Dimensions: [
  //         {
  //           Name: 'ServiceName',
  //           Value: serviceName
  //         }
  //       ],
  //       Unit: '', // 'Count' or 'Milliseconds'
  //       Value: 0 // Total value
  //     }
  //   ],
  //   Namespace: 'Udacity/Serveless'
  // }).promise()

  // TODO: Record time it took to get a response
  // TODO: Record if a response was successful or not
}

function timeInMs() {
  return new Date().getTime()
}
