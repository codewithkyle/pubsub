type Subscriptions = {
	[ticket: string]: {
		[id: string]: Function;
	};
};
class EventBusController {
	private subscriptions: Subscriptions;

	constructor() {
		this.subscriptions = {};
	}

	public create(ticket: string = this.uid()) {
		if (ticket in this.subscriptions){
			console.warn(`A subscription has already been created for: ${ticket}`);
		} else {
			this.subscriptions[ticket] = {};
		}		
		return ticket;
	}

	public subscribe(ticket: string, inbox: Function) {
		const id = this.uid();
		this.subscriptions[ticket][id] = inbox;
		return id;
	}

	public unsubscribe(id: string, ticket: string = null) {
		if (ticket === null){
			for (const subTicket in this.subscriptions){
				for (const inboxId in this.subscriptions[subTicket]){
					if (id === inboxId){
						ticket = subTicket;
						break;
					}
				}
				if (ticket !== null){
					break;
				}
			}
		}
		delete this.subscriptions?.[ticket]?.[id];
		if (Object.keys(this.subscriptions?.[ticket])?.length === 0) {
			delete this.subscriptions[ticket];
		}
	}

	public publish(ticket: string, data: any) {
		for (const id in this.subscriptions?.[ticket]) {
			this.subscriptions[ticket][id](data);
		}
	}

	public destroy(ticket: string) {
		delete this.subscriptions?.[ticket];
	}

    private uid(): string {
        return new Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
            .join("-");
    }
    
}
const EventBus:EventBusController = new EventBusController();
const createSubscription:(ticket?:string)=>string = EventBus.create.bind(EventBus);
const destroySubscription:(ticket:string)=>void  = EventBus.destroy.bind(EventBus);
/** @deprecated use the `publish()` method instead */
const post:(ticket:string, data:any)=>void  = EventBus.publish.bind(EventBus);
const publish:(ticket:string, data:any)=>void  = EventBus.publish.bind(EventBus);
const subscribe:(ticket:string, inbox:Function)=>string  = EventBus.subscribe.bind(EventBus);
const unsubscribe:(inboxId:string, ticket?:string)=>void  = EventBus.unsubscribe.bind(EventBus);
export { EventBus, createSubscription, destroySubscription, post, publish, subscribe, unsubscribe };