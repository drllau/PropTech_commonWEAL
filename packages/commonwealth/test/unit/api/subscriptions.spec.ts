/* eslint-disable no-unused-expressions */

import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import jwt from 'jsonwebtoken';
import { NotificationCategories } from 'common-common/src/types';
import { NotificationSubscription } from 'models';
import app, { resetDatabase } from '../../../server-test';
import { JWT_SECRET } from '../../../server/config';
import * as modelUtils from '../../util/modelUtils';
import models from '../../../server/database';
import Errors from '../../../server/routes/subscription/errors';
import { Errors as MarkNotifErrors } from '../../../server/routes/markNotificationsRead';

chai.use(chaiHttp);
const { expect } = chai;

describe.skip('Subscriptions Tests', () => {
  let jwtToken;
  let loggedInAddr;
  let loggedInAddrId;
  const chain = 'ethereum';
  // const community = chain;

  before('reset database', async () => {
    await resetDatabase();
    // get logged in address/user with JWT
    const result = await modelUtils.createAndVerifyAddress({ chain });
    loggedInAddr = result.address;
    loggedInAddrId = result.address_id;
    jwtToken = jwt.sign(
      { id: result.user_id, email: result.email },
      JWT_SECRET
    );
  });

  describe('/createSubscription test', () => {
    it('should create new-thread subscription on community', async () => {
      const object_id = chain;
      const is_active = true;
      const category = NotificationCategories.NewThread;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(object_id);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should create new-thread subscription on chain', async () => {
      const object_id = chain;
      const is_active = true;
      const category = NotificationCategories.NewThread;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(object_id);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should make new-comment subscription on thread in community', async () => {
      let res = await modelUtils.createThread({
        chainId: chain,
        address: loggedInAddr,
        jwt: jwtToken,
        title: 't',
        body: 't',
        kind: 'discussion',
        stage: 'discussion',
        topicName: 't',
        topicId: undefined,
      });
      const object_id = `discussion_${res.result.id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should make new-comment subscription on thread in chain', async () => {
      let res = await modelUtils.createThread({
        chainId: chain,
        address: loggedInAddr,
        jwt: jwtToken,
        title: 't2',
        body: 't2',
        kind: 'discussion',
        stage: 'discussion',
        topicName: 't',
        topicId: undefined,
      });
      const object_id = `discussion_${res.result.id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should make new-comment subscription on comment on thread in chain', async () => {
      const res1 = await modelUtils.createThread({
        chainId: chain,
        address: loggedInAddr,
        jwt: jwtToken,
        title: 't2',
        body: 't2',
        kind: 'discussion',
        stage: 'discussion',
        topicName: 't',
        topicId: undefined,
      });
      let res = await modelUtils.createComment({
        chain,
        address: loggedInAddr,
        jwt: jwtToken,
        text: 'cw4eva',
        root_id: `discussion_${res1.result.id}`,
      });
      const object_id = `comment-${res.result.id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should make new-comment subscription on comment on thread in community', async () => {
      let res = await modelUtils.createThread({
        chainId: chain,
        address: loggedInAddr,
        jwt: jwtToken,
        title: 't3',
        body: 't3',
        kind: 'discussion',
        stage: 'discussion',
        topicName: 't',
        topicId: undefined,
      });
      res = await modelUtils.createComment({
        chain,
        address: loggedInAddr,
        jwt: jwtToken,
        text: 'hi',
        root_id: `discussion_${res.result.id}`,
      });
      const object_id = `comment-${res.result.id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should make new-comment subscription on chainEntity', async () => {
      const entityInstance = await models['ChainEntity'].create({
        chain: 'edgeware',
        type: 'treasury-proposal',
        type_id: '6',
        completed: false,
      });
      const object_id = `treasuryproposal_${entityInstance.type_id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          category,
          is_active,
          object_id,
          chain_id: 'edgeware',
        });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should fail to make new-comment subscription on chainEntity without chain', async () => {
      const chainEntity = await models['ChainEntity'].create({
        chain: 'edgeware',
        type: 'treasury-proposal',
        type_id: '6',
        completed: false,
      });
      const object_id = `treasuryproposal_${chainEntity.type_id}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.ChainRequiredForEntity);
    });

    it('should fail to make new-comment subscription on nonexistent chainEntity', async () => {
      const object_id = `treasuryproposal_${10}`;
      const is_active = true;
      const category = NotificationCategories.NewComment;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          category,
          is_active,
          object_id,
          chain_id: 'edgeware',
        });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoChainEntity);
    });

    it('should fail to make new-comment subscription on nonexistent comment', async () => {
      const object_id = 'comment-420';
      const is_active = true;
      const category = NotificationCategories.NewComment;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          category,
          is_active,
          object_id,
          chain_id: 'edgeware',
        });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoComment);
    });

    it('should fail to make new-comment subscription on nonexistent thread', async () => {
      const object_id = 'discussion_420';
      const is_active = true;
      const category = NotificationCategories.NewComment;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          category,
          is_active,
          object_id,
          chain_id: 'edgeware',
        });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoThread);
    });

    it.skip('should make chain-event subscription', async () => {
      const object_id = 'edgeware-democracy-proposed';
      const is_active = true;
      const category = NotificationCategories.ChainEvent;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body).to.not.be.null;
      expect(res.body.result.category_id).to.be.equal(category);
      expect(res.body.result.object_id).to.equal(`${object_id}`);
      expect(res.body.result.is_active).to.be.equal(true);
    });

    it('should fail to make chain-event subscription with invalid type', async () => {
      const object_id = 'edgeware-onchain-party';
      const is_active = true;
      const category = NotificationCategories.ChainEvent;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.InvalidChainEventId);
    });

    it('should fail to make chain-event subscription with invalid chain', async () => {
      const object_id = 'zakchain-treasury-proposal';
      const is_active = true;
      const category = NotificationCategories.ChainEvent;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.InvalidChain);
    });

    it('should fail to make new-mention subscription generally', async () => {
      const object_id = 'user-2020';
      const is_active = true;
      const category = NotificationCategories.NewMention;
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoMentions);
    });

    it('should fail to make subscription with nonexistent category_id', async () => {
      const object_id = 'treasuryproposal_6';
      const is_active = true;
      const category = 'offchain-event';
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.InvalidNotificationCategory);
    });

    it('should fail to make subscription with nonexistent object_id', async () => {
      const object_id = undefined;
      const is_active = true;
      const category = 'offchain-event';
      const res = await chai
        .request(app)
        .post('/api/createSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, category, is_active, object_id });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoCategoryAndObjectId);
    });

    it.skip('should check /viewSubscriptions for all', async () => {
      const subscription = await modelUtils.createSubscription({
        object_id: chain,
        jwt: jwtToken,
        is_active: true,
        category: NotificationCategories.NewThread,
      });
      const res = await chai
        .request(app)
        .get('/api/viewSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
    });
  });

  describe('/disableSubscriptions + /enableSubscriptions', () => {
    let subscription: NotificationSubscription;
    beforeEach('creating a subscription', async () => {
      subscription = await modelUtils.createSubscription({
        object_id: chain,
        jwt: jwtToken,
        is_active: true,
        category: NotificationCategories.NewThread,
      });
    });
    it('should pause a subscription', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/disableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': [subscription.id] });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
    });

    it('should unpause a subscription', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/enableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': [subscription.id] });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should pause and unpause a subscription with just the id as string (not array)', async () => {
      expect(subscription).to.not.be.null;
      let res = await chai
        .request(app)
        .post('/api/disableSubscriptions')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          'subscription_ids[]': subscription.id.toString(),
        });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      res = await chai
        .request(app)
        .post('/api/enableSubscriptions')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          'subscription_ids[]': subscription.id.toString(),
        });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should pause and unpause an array of subscription', async () => {
      const subscriptions = [];
      for (let i = 0; i < 3; i++) {
        subscriptions.push(
          modelUtils.createSubscription({
            object_id: chain,
            jwt: jwtToken,
            is_active: true,
            category: NotificationCategories.NewThread,
          })
        );
      }
      const subscriptionIds = (await Promise.all(subscriptions)).map(
        (s) => s.id
      );
      let res = await chai
        .request(app)
        .post('/api/disableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': subscriptionIds });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');

      res = await chai
        .request(app)
        .post('/api/enableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': subscriptionIds });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should fail to enable and disable subscriptions not owned by the requester', async () => {
      expect(subscription).to.not.be.null;
      const result = await modelUtils.createAndVerifyAddress({ chain });
      const newJWT = jwt.sign(
        { id: result.user_id, email: result.email },
        JWT_SECRET
      );
      let res = await chai
        .request(app)
        .post('/api/enableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: newJWT, 'subscription_ids[]': [subscription.id] });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NotUsersSubscription);
      res = await chai
        .request(app)
        .post('/api/disableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: newJWT, 'subscription_ids[]': [subscription.id] });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NotUsersSubscription);
    });

    it('should fail to enable and disable subscription when no subscriptions are passed to route', async () => {
      let res = await chai
        .request(app)
        .post('/api/enableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoSubscriptionId);
      res = await chai
        .request(app)
        .post('/api/disableSubscriptions')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoSubscriptionId);
    });
  });

  describe('/enableImmediateEmails and /disableImmediateEmails', () => {
    let subscription: NotificationSubscription;
    beforeEach('creating a subscription', async () => {
      subscription = await modelUtils.createSubscription({
        object_id: chain,
        jwt: jwtToken,
        is_active: true,
        category: NotificationCategories.NewThread,
      });
    });

    it('should turn on immediate emails, /enableImmediateEmails', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/enableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': [subscription.id] });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
    });

    it('should turn off immediate emails, /disableImmediateEmails', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/disableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, 'subscription_ids[]': [subscription.id] });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should fail to enable and disable immediate emails when not passed ids', async () => {
      expect(subscription).to.not.be.null;
      let res = await chai
        .request(app)
        .post('/api/enableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoSubscriptionId);
      res = await chai
        .request(app)
        .post('/api/disableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoSubscriptionId);
    });

    it('should successfully enable and disable with just a string id', async () => {
      expect(subscription).to.not.be.null;
      let res = await chai
        .request(app)
        .post('/api/enableImmediateEmails')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          'subscription_ids[]': subscription.id.toString(),
        });
      expect(res.body).to.not.be.null;
      expect(res.body.status).to.be.equal('Success');
      res = await chai
        .request(app)
        .post('/api/disableImmediateEmails')
        .set('Accept', 'application/json')
        .send({
          jwt: jwtToken,
          'subscription_ids[]': subscription.id.toString(),
        });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should fail to enable and disable immediate emails when requester does not own the subscription', async () => {
      const result = await modelUtils.createAndVerifyAddress({ chain });
      const newJwt = jwt.sign(
        { id: result.user_id, email: result.email },
        JWT_SECRET
      );
      expect(subscription).to.not.be.null;
      let res = await chai
        .request(app)
        .post('/api/enableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: newJwt, 'subscription_ids[]': [subscription.id] });
      expect(res.body).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NotUsersSubscription);
      res = await chai
        .request(app)
        .post('/api/disableImmediateEmails')
        .set('Accept', 'application/json')
        .send({ jwt: newJwt, 'subscription_ids[]': [subscription.id] });
      expect(res.body.error).to.be.equal(Errors.NotUsersSubscription);
    });
  });

  describe('/deleteSubscription', () => {
    let subscription;

    beforeEach('make subscription', async () => {
      subscription = await modelUtils.createSubscription({
        object_id: chain,
        jwt: jwtToken,
        is_active: true,
        category: NotificationCategories.NewThread,
      });
    });

    it('should delete an active subscription', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/deleteSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, subscription_id: subscription.id });
      expect(res.body.status).to.be.equal('Success');
    });

    it('should fail to delete when no subscription id is passed', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/deleteSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken });
      expect(res.body.error).to.not.be.null;
      expect(res.body.error).to.be.equal(Errors.NoSubscriptionId);
    });

    it('should fail to find a bad subscription id', async () => {
      expect(subscription).to.not.be.null;
      const res = await chai
        .request(app)
        .post('/api/deleteSubscription')
        .set('Accept', 'application/json')
        .send({ jwt: jwtToken, subscription_id: 'hello' });
      expect(res.body.error).to.not.be.null;
    });
  });

  describe('Notification Routes', () => {
    let subscription;
    let thread;
    let notifications;

    it('emitting a notification', async () => {
      // Subscription for Default User in 'Staking'
      subscription = await modelUtils.createSubscription({
        object_id: chain,
        jwt: jwtToken,
        is_active: true,
        category: NotificationCategories.NewThread,
      });
      // New User makes a thread in 'Staking', should emit notification to Default User
      const result = await modelUtils.createAndVerifyAddress({ chain });
      const newAddress = result.address;
      const newJWT = jwt.sign(
        { id: result.user_id, email: result.email },
        JWT_SECRET
      );
      thread = await modelUtils.createThread({
        chainId: chain,
        jwt: newJWT,
        address: newAddress,
        title: 'hi',
        body: 'hi you!',
        kind: 'discussion',
        stage: 'discussion',
        topicName: 't',
        topicId: undefined,
      });
      expect(subscription).to.not.be.null;
      expect(thread).to.not.be.null;
    });

    describe('/viewNotifications: return notifications to user', () => {
      it("should return all notifications with just a user's jwt", async () => {
        const res = await chai
          .request(app)
          .post('/api/viewDiscussionNotifications')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
        expect(res.body.result.subscriptions.length).to.be.greaterThan(0);
        notifications = res.body.result.subscriptions;
      });

      it('should return only unread notifications', async () => {
        const res = await chai
          .request(app)
          .post('/api/viewDiscussionNotifications')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken, unread_only: true });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
        expect(res.body.result.subscriptions.length).to.be.greaterThan(0);
        notifications = res.body.result.subscriptions;
      });

      it('should return only notifications with active_only turned on', async () => {
        const res = await chai
          .request(app)
          .post('/api/viewDiscussionNotifications')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken, active_only: true });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
        expect(res.body.result.subscriptions.length).to.be.greaterThan(0);
        notifications = res.body.result.subscriptions;
      });
    });

    describe('/markNotificationsRead', async () => {
      it('should pass when query formatted correctly', async () => {
        // Mark Notifications Read for Default User
        expect(notifications).to.not.be.null;
        const notification_ids = notifications.map((n) => {
          return n.id;
        });
        const res = await chai
          .request(app)
          .post('/api/markNotificationsRead')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken, 'notification_ids[]': notification_ids });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
      });
      it('should pass when notification id is string', async () => {
        // Mark Notifications Read for Default User
        expect(notifications).to.not.be.null;
        const notification_ids = notifications.map((n) => {
          return n.id;
        });
        const res = await chai
          .request(app)
          .post('/api/markNotificationsRead')
          .set('Accept', 'application/json')
          .send({
            jwt: jwtToken,
            'notification_ids[]': notification_ids[0].toString(),
          });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
      });
      it('should fail when no notifications are passed', async () => {
        const res = await chai
          .request(app)
          .post('/api/markNotificationsRead')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken });
        expect(res.body).to.not.be.null;
        expect(res.body.error).to.not.be.null;
        expect(res.body.error).to.be.equal(MarkNotifErrors.NoNotificationIds);
      });
    });

    describe('/clearReadNotifications', async () => {
      it('should pass when query formatted correctly', async () => {
        // Clear Read for Default User
        expect(notifications).to.not.be.null;
        const res = await chai
          .request(app)
          .post('/api/clearReadNotifications')
          .set('Accept', 'application/json')
          .send({ jwt: jwtToken });
        expect(res.body).to.not.be.null;
        expect(res.body.status).to.be.equal('Success');
      });
    });
  });
});
