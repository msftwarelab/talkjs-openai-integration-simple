import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { Document, VectorStoreIndex } from 'llamaindex';

export class UserController {

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const userId = body.data.message.senderId;
      const message = body.data.message.text;
      const conversationId = body.data.message.conversationId;
      console.log(message)
      console.log(userId)
      if (userId != process.env.ADMIN_ID) {
        const userData = await this.fetchUserData(userId);
        console.log("=====================query to chat engine==========================");
        const reply = await this.queryIndex(message, userData);
        console.log("=============================reply=================================\n", reply);
        this.sendReplyToTalkJS(reply, conversationId);
        res.status(200).send();
      }
    } catch (error) {
      next(error);
    }
  };

  public sendReplyToTalkJS = async (responseFromDialog: string, conversationId: string): Promise<void> => {
    const message = {
      text: responseFromDialog,
      sender: '5',
      type: 'UserMessage',
    };

    const messagesArray = [message];
    axios
      .post(`https://api.talkjs.com/v1/tPEFwirl/conversations/${conversationId}/messages`, messagesArray, {
        headers: {
          Authorization: 'Bearer sk_test_MaLWHR6uWIhglDlnDahbpeyRuuODARxH',
          'Content-Type': 'application/json',
        },
      })
      .then(res => {
        console.log(`statusCode: ${res.status}`);
      })
      .catch(error => {
        console.error(error);
      })
      .catch(error => console.log(error.response.request._response));
  };

  public fetchUserData = async (userId: number): Promise<any> => {
    try {
      const response = await axios.get(`https://xqsu-ttbr-nccs.n7c.xano.io/api:zTMR6VS5/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  public queryIndex = async (message: string, userData: any): Promise<any> => {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const document = new Document({ text: JSON.stringify(userData) });

    const index = await VectorStoreIndex.fromDocuments([document]);

    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query(message);
    return response.toString();
  };
}
