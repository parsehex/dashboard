interface IntakeQRow_AuditTrail {
	Id: string;
	Date: number;
	Action: string;
	Actor: string;
	Client: string;
	/**
	 * Can be anything from the name of a form to the name of a client.
	 *
	 * Basically describes whatever object that this action affected.
	 */
	Object: string;
	Ip: string;
	ObjectId: string;
	ObjectStateId: string;
	ObjectType:
		| 'Assistant'
		| 'Client'
		| 'ConsentForm'
		| 'Form'
		| 'Member'
		| 'Note'
		| 'Questionnaire';
	ActorId: string;
}
