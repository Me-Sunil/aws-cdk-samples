import { Context, SQSEvent } from 'aws-lambda';

export async function handler(event: SQSEvent, context: Context) {
    console.log(context);

    console.log("Processing SQS Event");
    event.Records.forEach(record => {
        console.log(record.body);
    })

    return {
        status: 200,
        body: 'Processing Done'
    }
}  