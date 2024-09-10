/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 * 3. SaaS Restriction: This software, or any derivative of it, may not be used to offer a competing product or service (SaaS) without prior written consent from Hexastack. Offering the software as a service or using it in a commercial cloud environment without express permission is strictly prohibited.
 */

import mongoose from 'mongoose';

import { MessageCreateDto } from '@/chat/dto/message.dto';
import { MessageModel, Message } from '@/chat/schemas/message.schema';

import { installSubscriberFixtures } from './subscriber';
import { getFixturesWithDefaultValues } from '../defaultValues';
import { TFixturesDefaultValues } from '../types';

const messages: MessageCreateDto[] = [
  {
    mid: 'mid-1',
    sender: '1',
    recipient: '1',
    sentBy: '0',
    message: { text: 'Hello from the past' },
    read: true,
    delivery: true,
  },
  {
    mid: 'mid-2',
    sender: '1',
    recipient: '1',
    sentBy: '0',
    message: { text: 'Hello' },
    delivery: true,
  },
  {
    mid: 'mid-3',
    sender: '1',
    recipient: '1',
    sentBy: '0',
    message: { text: 'Hello back' },
  },
];

export const messageDefaultValues: TFixturesDefaultValues<Message> = {
  read: false,
  delivery: false,
  handover: false,
  createdAt: new Date('2024-01-01T00:00:00.00Z'),
};

export const messageFixtures = getFixturesWithDefaultValues<Message>({
  fixtures: messages,
  defaultValues: messageDefaultValues,
});

export const installMessageFixtures = async () => {
  const { subscribers, users } = await installSubscriberFixtures();
  const Message = mongoose.model(MessageModel.name, MessageModel.schema);
  return await Message.insertMany(
    messageFixtures.map((m) => {
      return {
        ...m,
        sender: m.sender ? subscribers[parseInt(m.sender)].id : null,
        recipient: m.recipient ? subscribers[parseInt(m.recipient)].id : null,
        sentBy: m.sentBy ? users[parseInt(m.sentBy)].id : null,
      };
    }),
  );
};
