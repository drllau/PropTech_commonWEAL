import moment from 'moment';

class NotificationSubscription {
  public readonly id: number;
  public readonly category: string;
  public readonly objectId: string;
  public readonly createdAt: moment.Moment;
  public readonly Chain: string;
  public readonly ChainEventType: any;
  public readonly Comment: any;
  public readonly Thread: any;

  private _immediateEmail: boolean;
  public get immediateEmail() { return this._immediateEmail; }
  public enableImmediateEmail() { this._immediateEmail = true; }
  public disableImmediateEmail() { this._immediateEmail = false; }

  private _isActive: boolean;
  public get isActive() { return this._isActive; }
  public enable() { this._isActive = true; }
  public disable() { this._isActive = false; }

  constructor(
    id,
    category,
    objectId,
    isActive,
    createdAt,
    immediateEmail,
    Chain?,
    ChainEventType?,
    Comment?,
    Thread?,
  ) {
    this.id = id;
    this.category = category;
    this.objectId = objectId;
    this._isActive = isActive;
    this.createdAt = moment(createdAt);
    this._immediateEmail = immediateEmail;
    this.Chain = Chain;
    this.ChainEventType = ChainEventType;
    this.Comment = Comment;
    this.Thread = Thread;
  }

  public static fromJSON(json) {
    return new NotificationSubscription(
      json.id,
      json.category_id,
      json.object_id,
      json.is_active,
      json.created_at,
      json.immediate_email,
      json.chain_id,
      json.ChainEventType || json.chain_event_type_id,
      json.Comment || json.offchain_comment_id,
      json.Thread || json.offchain_thread_id,
    );
  }
}

export default NotificationSubscription;
