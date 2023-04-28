/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios')

const {PermissionsDisabledError} = "./errors"

const GIVEN_NAME_PERMISSION = "alexa::profile:name:read";
const EMAIL_PERMISSION = "alexa::profile:email:read";
const PHONE_PERMISSION = "alexa::profile:mobile_number:read";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Book an Auto to look for autos nearby.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            // .withSimpleCard(speakOutput)
            .getResponse();
    }
};

const InitiateAutoBookingHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InitiateAutoBooking';
    },
    async handle(handlerInput) {
        // try {
            const {name, phoneNumber, email} = handlerInput.attributesManager.getSessionAttributes();
            
            const speakOutput = `Hello ${name? name : "Unknown User"}! Please tell me where you would like to go.` ;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse(); 
            
            // const {permissions} = handlerInput.requestEnvelope.context.System.user;
            
        //     console.log(`Attributes: ${handlerInput.getSessionAttributes()}`)
            
        //     if(!permissions) {
        //         throw {statusCode: 401, message: 'No permissions enabled!'}
        //         // return handlerInput.responseBuilder
        //         //     .speak("Permissions for obtaining user data not provided!")
        //     } else {
        //         const upsService = handlerInput.serviceClientFactory.getUpsServiceClient();
        //         const profileName = await upsService.getProfileName();
        //         const phoneNumber = await upsService.getProfileMobileNumber();
        //         const email = await upsService.getProfileEmail();
        //         const speakOutput = `Hello ${profileName? profileName : "Unknown Name"} from the folks here at Namma Yatri! Do you want to book an auto?` ;
        //         return handlerInput.responseBuilder
        //         .speak(speakOutput)
        //         .getResponse();   
        //     }
        // } catch (err) {
        //     console.error(`Error: ${JSON.stringify(err)}`)
        //     handlerInput.responseBuilder.withAskForPermissionsConsentCard(GIVEN_NAME_PERMISSION);
        //         return handlerInput.responseBuilder
        //         .speak("Oh no! You have not enabled permissions for Name, Phone and Email! These are required for successful")
        //         .getResponse(); 
        // }
        
    }
}

const FixDropLocationIntentHandler = {
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FixDropLocationIntent';
    },
    
    handle(handlerInput) {
        
        const {requestEnvelope} = handlerInput;
        const dropLocation = Alexa.getSlotValue(requestEnvelope, 'droplocation');
        const {name, phoneNumber, email} = handlerInput.attributesManager.getSessionAttributes();
        
        let data = JSON.stringify({
            fullName: name,
            phone: phoneNumber,
            email,
            metaData: handlerInput.context.get
        })
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://whatsapp.sandeepkumar.in/api/book/v1/assistantBooking',
            headers: {
                'Content-Type': 'application/json'
            },
            data
        }
        
        axios.request(config).then((_) => console.log("Posted")).catch(err => console.error(`ERROR: ${JSON.stringify()}`))
        
        const speakOutput = `Please wait for confirmation while we look for autos nearby to ${dropLocation? dropLocation : "Unknown place"}! After confirmation, we will send a WhatsApp message to your number registered with your Amazon account that is being used by Alexa!`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
    
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error.message)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FetchDetailsInterceptor = {
    async process(handlerInput) {
    const { attributesManager, serviceClientFactory, requestEnvelope } =
      handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if(!sessionAttributes['name'] || !sessionAttributes['phoneNumber'] || !sessionAttributes['email'] ) {
      try {
          const {permissions} = requestEnvelope.context.System.user;
          if(!(permissions && permissions.consentToken)) {
            throw { statusCode: 401, message: "No permissions available" };
          }
          const upsService = serviceClientFactory.getUpsServiceClient();
          const profileName = await upsService.getProfileName();
          const phoneNumber = await upsService.getProfileMobileNumber();
          const email = await upsService.getProfileEmail();
          if(profileName) {
            sessionAttributes['name'] = profileName;
            sessionAttributes['phoneNumber'] = phoneNumber;
            sessionAttributes['email'] = email;
          }
      } catch (error) {
          console.log("Error in Fetching Details", error);
          if(error.statusCode === 401 || error.statusCode === 403) {
            handlerInput.responseBuilder.withAskForPermissionsConsentCard(
              ["alexa::profile:name:read", "alexa::profile:mobile_number:read", "alexa::profile:email:read"]
            )
          }
        }
    }
  }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .withApiClient(new Alexa.DefaultApiClient())
    .addRequestInterceptors(FetchDetailsInterceptor)
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        InitiateAutoBookingHandler,
        FixDropLocationIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();