// ═══════════════════════════════════════════════════════════════════════════
// @amlhubs/fipa-ip — IEEE FIPA Interaction Protocol Library
// ───────────────────────────────────────────────────────────────────────────
// Authoritative spec set (all FIPA Standards 2002-12 unless marked Experimental):
//   - FIPA SC00026H — Request Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00026/SC00026H.html
//   - FIPA SC00027H — Query Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00027/SC00027H.html
//   - FIPA SC00028H — Request When Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00028/SC00028H.html
//   - FIPA SC00029H — Contract Net Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00029/SC00029H.html
//   - FIPA SC00030H — Iterated Contract Net Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00030/SC00030H.html
//   - FIPA XC00031F — English Auction Interaction Protocol Specification (Experimental, 2001-08-10)
//     http://www.fipa.org/specs/fipa00031/XC00031F.html
//   - FIPA XC00032F — Dutch Auction Interaction Protocol Specification (Experimental, 2001-08-10)
//     http://www.fipa.org/specs/fipa00032/XC00032F.html
//   - FIPA SC00033H — Brokering Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00033/SC00033H.html
//   - FIPA SC00034H — Recruiting Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00034/SC00034H.html
//   - FIPA SC00035H — Subscribe Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00035/SC00035H.html
//   - FIPA SC00036H — Propose Interaction Protocol Specification (Standard)
//     http://www.fipa.org/specs/fipa00036/SC00036H.html
//
// Authority: IEEE Computer Society Standards Activities Board (FIPA Standards
//   Committee since 2005). FIPA standardspecs index:
//   http://www.fipa.org/repository/standardspecs.html
//   Interaction Protocols catalog: http://www.fipa.org/repository/ips.php3
//
// Scope (v0.0.1):
//   - One IInteractionProtocol abstract Class — root of the 11 protocol surface
//   - One IProtocolRole IEnumeration with 8 IEnumerationLiteral instances:
//       Initiator, Participant, Broker, Manager, Contractor, Recruiter,
//       Auctioneer, Bidder (the role vocabulary spanning all 11 protocols)
//   - One IProtocolStep IClass with 5 IProperty instances:
//       sender (ProtocolRole), receiver (ProtocolRole),
//       performative (FK → @amlhubs/fipa-acl IPerformativeKind*),
//       precondition (IConstraint with IOpaqueExpression body),
//       rationalEffect (IConstraint with IOpaqueExpression body)
//   - One IProtocolPattern IClass realising the ordered step sequence as a
//       Slot of InstanceSpecification (UML §9.8.5 / §9.8.7)
//   - 11 concrete IInteractionProtocol* interfaces — one per FIPA IP, each
//       extending IInteractionProtocol with its specific role set, the
//       fipa-protocol-* token of the ACL message protocol parameter, and the
//       step sequence quoted from the AUML diagram of the SC document
//   - IProtocolBranch IClass encoding "alternative protocol flow paths" as
//       IConstraint with IOpaqueExpression body (UML §7.6 / §8.3.2.4)
//
// CMOF compliance:
//   Every metaclass declared in this file is a typed projection of one of the
//   26 CMOF-whitelisted UML 2.5.1 metaclasses (Class, Property, Association,
//   Enumeration, EnumerationLiteral, Generalization, Constraint,
//   OpaqueExpression, Slot, InstanceSpecification, Comment). The projection
//   is documented in the JSDoc header of each interface via the @generalization
//   tag pointing at the parent UML metaclass and §-section. Witness
//   implementations are minimal data carriers extending IElement (the UML
//   §7.8.6 root) — the typed FIPA-IP surface, the UML grounding, and the
//   registry-key element identity.
//
// Architectural ordering:
//   @amlhubs/uml (root) ──upstream──► @amlhubs/fipa-acl
//                       ──upstream──► @amlhubs/ocl ──upstream──► @amlhubs/fipa-ip
//   @amlhubs/fipa-acl   ──upstream──► @amlhubs/fipa-ip (this package)
//
// JSDoc citation discipline:
//   Every interface and class JSDoc block declares @standard, @specification,
//   @section, @metaclass, @generalization, @definition, and the appropriate
//   @ownedAttributes / @associationEnds / @operations / @constraints tags.
//   Protocol-flow descriptions are quoted VERBATIM from the SC source —
//   never paraphrased.
// ═══════════════════════════════════════════════════════════════════════════

import type { IElement } from '@amlhubs/uml'
import type {
  IPerformativeKindAcceptProposal,
  IPerformativeKindAgree,
  IPerformativeKindCancel,
  IPerformativeKindCfp,
  IPerformativeKindFailure,
  IPerformativeKindInform,
  IPerformativeKindNotUnderstood,
  IPerformativeKindPropose,
  IPerformativeKindProxy,
  IPerformativeKindQueryIf,
  IPerformativeKindQueryRef,
  IPerformativeKindRefuse,
  IPerformativeKindRejectProposal,
  IPerformativeKindRequest,
  IPerformativeKindRequestWhen,
  IPerformativeKindSubscribe,
} from '@amlhubs/fipa-acl'

// ═══════════════════════════════════════════════════════════════════════════
// FIPA INTERACTION PROTOCOL METACLASSES
// ═══════════════════════════════════════════════════════════════════════════
// BEGIN-EXTRACTED-FIPA-IP

// ───────────────────────────────────────────────────────────────────────────
// SECTION 1 — ProtocolRole Enumeration (covering all 11 IP role vocabularies)
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36} (2002-12, plus XC00031F / XC00032F 2001-08-10)
 * @section §1 — Each Interaction Protocol identifies its participating roles
 *   in its first numbered section ("Explanation of the Protocol Flow").
 * @metaclass concrete
 * @generalization IEnumeration (UML §10.2.5) — projection of the FIPA
 *   protocol-role vocabulary as a CMOF Enumeration spanning all 11 protocols.
 * @definition The ProtocolRole enumeration enumerates the role types that
 *   participate in any FIPA Interaction Protocol. Each literal identifies one
 *   role kind; concrete protocols bind their step senders and receivers to
 *   exactly the role kinds their AUML diagram declares. The enumeration is
 *   the union of role mentions across SC00026H–SC00036H plus XC00031F /
 *   XC00032F: Initiator (every protocol), Participant (most protocols),
 *   Broker (SC00033H §1, SC00034H §1), Manager + Contractor (SC00029H §1
 *   — Contract Net contractor-manager terminology), Recruiter (SC00034H §1),
 *   Auctioneer + Bidder (XC00031F §1, XC00032F §1).
 * @ownedLiterals
 *   Initiator, Participant, Broker, Manager, Contractor, Recruiter,
 *   Auctioneer, Bidder
 */
export interface IProtocolRole extends IElement {
  readonly metaClass: 'ProtocolRole';
  readonly umlMetaclass: 'Enumeration';
  readonly ownedLiteralIds: ReadonlyArray<string>;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36} — appears in §1 of every protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The role of the agent that initiates a FIPA Interaction
 *   Protocol conversation by sending the first ACL message. The Initiator
 *   chooses the conversation-id parameter and is the agent to which the
 *   Participant returns its response.
 */
export interface IProtocolRoleInitiator extends IElement {
  readonly metaClass: 'ProtocolRoleInitiator';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36} — appears in §1 of every protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The role of the agent that responds to an Initiator within a
 *   FIPA Interaction Protocol. The Participant receives the first ACL
 *   message of the conversation and returns subsequent messages tagged with
 *   the same conversation-id.
 */
export interface IProtocolRoleParticipant extends IElement {
  readonly metaClass: 'ProtocolRoleParticipant';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA Brokering Interaction Protocol Specification
 * @specification SC00033H (2002-12-03)
 * @section §1 — Brokering Interaction Protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Broker role of the FIPA Brokering Interaction Protocol
 *   (SC00033H §1). A Broker receives a proxy request from an Initiator
 *   together with a referential expression that identifies sub-targets, and
 *   forwards the embedded message to the matching agents on the Initiator's
 *   behalf, returning their responses to the Initiator.
 */
export interface IProtocolRoleBroker extends IElement {
  readonly metaClass: 'ProtocolRoleBroker';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA Contract Net Interaction Protocol Specification
 * @specification SC00029H (2002-12-03)
 * @section §1 — Contract Net Interaction Protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Manager role of the FIPA Contract Net Interaction Protocol
 *   (SC00029H §1). The Manager is the Contract Net Initiator that issues a
 *   call-for-proposals and selects among the proposals returned by the
 *   contractor agents to award the contract.
 */
export interface IProtocolRoleManager extends IElement {
  readonly metaClass: 'ProtocolRoleManager';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA Contract Net Interaction Protocol Specification
 * @specification SC00029H (2002-12-03)
 * @section §1 — Contract Net Interaction Protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Contractor role of the FIPA Contract Net Interaction
 *   Protocol (SC00029H §1). A Contractor is a Contract Net Participant that
 *   responds to the Manager's call-for-proposals either with a propose
 *   message containing its bid or with a refuse, and (if its proposal is
 *   accepted) executes the action and returns inform-done / inform-result /
 *   failure to the Manager.
 */
export interface IProtocolRoleContractor extends IElement {
  readonly metaClass: 'ProtocolRoleContractor';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA Recruiting Interaction Protocol Specification
 * @specification SC00034H (2002-12-03)
 * @section §1 — Recruiting Interaction Protocol
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Recruiter role of the FIPA Recruiting Interaction Protocol
 *   (SC00034H §1). A Recruiter receives a proxy request from an Initiator
 *   together with a referential expression that identifies sub-targets, and
 *   forwards a re-shaped (proxied) message to the matching agents on the
 *   Initiator's behalf — but, unlike a Broker, does not return the targets'
 *   responses; the targets reply directly to the Initiator.
 */
export interface IProtocolRoleRecruiter extends IElement {
  readonly metaClass: 'ProtocolRoleRecruiter';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA English Auction Interaction Protocol Specification
 * @specification XC00031F (2001-08-10) and FIPA Dutch Auction Interaction
 *   Protocol Specification XC00032F (2001-08-10)
 * @section §1 — Auction Interaction Protocols
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Auctioneer role of the FIPA Auction Interaction Protocols
 *   (XC00031F §1, XC00032F §1). The Auctioneer is the protocol Initiator
 *   that issues the call-for-proposals at successive ascending (English) or
 *   descending (Dutch) prices and identifies the winning Bidder.
 */
export interface IProtocolRoleAuctioneer extends IElement {
  readonly metaClass: 'ProtocolRoleAuctioneer';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

/**
 * @standard FIPA English Auction Interaction Protocol Specification
 * @specification XC00031F (2001-08-10)
 * @section §1 — Auction Interaction Protocols
 * @metaclass concrete
 * @generalization IEnumerationLiteral (UML §10.5.5)
 * @definition The Bidder role of the FIPA Auction Interaction Protocols
 *   (XC00031F §1). A Bidder is an Auction Participant that responds to the
 *   Auctioneer's call-for-proposals with a propose message carrying its bid
 *   at the current auction price.
 */
export interface IProtocolRoleBidder extends IElement {
  readonly metaClass: 'ProtocolRoleBidder';
  readonly umlMetaclass: 'EnumerationLiteral';
  readonly enumerationId: string;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 2 — ProtocolStep Class (UML §9.2 / §11.5)
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — every protocol's AUML
 *   diagram (§1 "Explanation of the Protocol Flow")
 * @metaclass abstract = false
 * @generalization IClass (UML §11.4) — projection of one ACL message exchange
 *   inside a protocol as a CMOF Class with five owned IProperty instances.
 * @definition A ProtocolStep is one ACL message exchange inside a FIPA
 *   Interaction Protocol. Each step names its sender role, its receiver
 *   role, the performative carried by the ACL message envelope, the
 *   feasibility precondition required of the sender, and the rational
 *   effect committed once the message is sent. The performative property is
 *   typed by the Performative enumeration of @amlhubs/fipa-acl (foreign-key
 *   reference). The precondition and rationalEffect properties are typed by
 *   IConstraint (UML §7.6) carrying an IOpaqueExpression (UML §8.3.2.4)
 *   body.
 * @ownedAttributes
 *   sender:        IProtocolRole [1..1]   — UML §9.2.5 ownedAttribute
 *   receiver:      IProtocolRole [1..1]   — UML §9.2.5 ownedAttribute
 *   performative:  IPerformativeKind* [1..1] — FK to @amlhubs/fipa-acl
 *   precondition:  IConstraint [0..1]     — UML §7.6.5 ownedRule
 *   rationalEffect:IConstraint [0..1]     — UML §7.6.5 ownedRule
 */
export interface IProtocolStep extends IElement {
  readonly metaClass: 'ProtocolStep';
  readonly umlMetaclass: 'Class';
  readonly senderId: string;
  readonly receiverId: string;
  readonly performativeId: string;
  readonly preconditionId?: string;
  readonly rationalEffectId?: string;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — sender column of every
 *   protocol's AUML diagram
 * @metaclass concrete
 * @generalization IProperty (UML §9.5) — one of the five owned attributes of
 *   IProtocolStep.
 * @definition The sender property of a ProtocolStep names the role kind of
 *   the agent that sends the ACL message in this step. Its type is
 *   IProtocolRole; its multiplicity is [1..1] because every ACL message
 *   originates from exactly one role.
 */
export interface IProtocolStepSender extends IElement {
  readonly metaClass: 'ProtocolStepSender';
  readonly umlMetaclass: 'Property';
  readonly classId: string;
  readonly typeId: string;
  readonly lower: 1;
  readonly upper: 1;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — receiver column of every
 *   protocol's AUML diagram
 * @metaclass concrete
 * @generalization IProperty (UML §9.5)
 * @definition The receiver property of a ProtocolStep names the role kind of
 *   the agent that receives the ACL message in this step. Its type is
 *   IProtocolRole; its multiplicity is [1..1] for unicast or [1..*] for
 *   broadcast steps such as Contract Net cfp (SC00029H §1) and the auction
 *   call-for-proposals (XC00031F §1).
 */
export interface IProtocolStepReceiver extends IElement {
  readonly metaClass: 'ProtocolStepReceiver';
  readonly umlMetaclass: 'Property';
  readonly classId: string;
  readonly typeId: string;
  readonly lower: 1;
  readonly upper: number;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — every step references a
 *   FIPA performative whose semantics are normatively defined in
 *   FIPA SC00037J (Communicative Act Library)
 * @metaclass concrete
 * @generalization IProperty (UML §9.5) typed by an IEnumerationLiteral
 *   (UML §10.5.5) drawn from the IPerformativeKind enumeration of
 *   @amlhubs/fipa-acl. Foreign-key reference, not aggregation.
 * @definition The performative property of a ProtocolStep names which
 *   FIPA performative is carried in the ACL message of this step. Its type
 *   is one of the 22 performative literals of @amlhubs/fipa-acl. Its
 *   multiplicity is [1..1] because the performative parameter of the ACL
 *   message envelope is mandatory (FIPA SC00061G §3).
 */
export interface IProtocolStepPerformative extends IElement {
  readonly metaClass: 'ProtocolStepPerformative';
  readonly umlMetaclass: 'Property';
  readonly classId: string;
  readonly performativeKindId: string;
  readonly lower: 1;
  readonly upper: 1;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — pre-state guards on each
 *   step transition, declared in §1 protocol flow narrative
 * @metaclass concrete
 * @generalization IConstraint (UML §7.6) carrying an IOpaqueExpression
 *   (UML §8.3.2.4) body whose language is "natural-english" (per
 *   SC00026H §1 narrative style) or "fipa-sl" (when the precondition is
 *   expressible as a FIPA SL formula).
 * @definition The precondition property of a ProtocolStep names the
 *   feasibility condition the sender must satisfy before it may emit the
 *   step's ACL message. The body of the constraint is an OpaqueExpression
 *   quoting the protocol's prose narrative VERBATIM where one is given.
 */
export interface IProtocolStepPrecondition extends IElement {
  readonly metaClass: 'ProtocolStepPrecondition';
  readonly umlMetaclass: 'Constraint';
  readonly stepId: string;
  readonly opaqueExpressionId: string;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — post-state effect of
 *   sending the step's ACL message, declared in §1 protocol flow narrative
 * @metaclass concrete
 * @generalization IConstraint (UML §7.6) carrying an IOpaqueExpression
 *   (UML §8.3.2.4) body whose language is "natural-english" or "fipa-sl".
 * @definition The rationalEffect property of a ProtocolStep names the
 *   commitment incurred by the sender once the step's ACL message is sent.
 *   The body of the constraint is an OpaqueExpression quoting the
 *   protocol's prose narrative VERBATIM where one is given.
 */
export interface IProtocolStepRationalEffect extends IElement {
  readonly metaClass: 'ProtocolStepRationalEffect';
  readonly umlMetaclass: 'Constraint';
  readonly stepId: string;
  readonly opaqueExpressionId: string;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 3 — ProtocolPattern Class (UML §11.4 / §9.8)
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — every protocol's AUML
 *   sequence diagram in §1 ("Figure 1: FIPA <Name> Interaction Protocol")
 * @metaclass abstract = false
 * @generalization IClass (UML §11.4) — projection of the ordered protocol
 *   step sequence as a CMOF Class whose owned attribute is realised by a
 *   Slot of InstanceSpecification (UML §9.8.5 / §9.8.7).
 * @definition A ProtocolPattern is the ordered legal step sequence of one
 *   FIPA Interaction Protocol. Each pattern owns (a) an ordered Slot of
 *   InstanceSpecification of IProtocolStep, encoding the step sequence
 *   visible in the AUML diagram, and (b) a set of IProtocolBranch instances
 *   encoding the alternative-flow constraints (refuse | agree, propose |
 *   refuse, accept-proposal | reject-proposal, etc.) that the AUML
 *   "decision diamond" of each protocol declares.
 * @ownedAttributes
 *   stepSlots:    Slot[1..*] of IProtocolStep — UML §9.8.5
 *   branches:     IProtocolBranch[*] — UML §7.6 ownedRule
 */
export interface IProtocolPattern extends IElement {
  readonly metaClass: 'ProtocolPattern';
  readonly umlMetaclass: 'Class';
  readonly stepSlotIds: ReadonlyArray<string>;
  readonly branchIds: ReadonlyArray<string>;
}

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — alternative-flow
 *   "decision diamond" branches in every protocol's AUML diagram
 * @metaclass concrete
 * @generalization IConstraint (UML §7.6) carrying an IOpaqueExpression
 *   (UML §8.3.2.4) body. Conditional-flow projection.
 * @definition A ProtocolBranch is a typed alternative inside a
 *   ProtocolPattern's step sequence. Each branch owns a guard expression
 *   (an OpaqueExpression whose language is "natural-english") and a list
 *   of step references that fire when the guard evaluates true. Examples:
 *   in SC00026H §1 the Participant branches on "refused | agreed", in
 *   SC00029H §1 the Manager branches on "accept-proposal | reject-proposal"
 *   for each received proposal, and in SC00030H §1 the Manager iterates
 *   the cfp-propose-evaluate cycle until convergence.
 */
export interface IProtocolBranch extends IElement {
  readonly metaClass: 'ProtocolBranch';
  readonly umlMetaclass: 'Constraint';
  readonly patternId: string;
  readonly guardExpressionId: string;
  readonly stepIds: ReadonlyArray<string>;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 4 — Abstract InteractionProtocol Class (UML §11.4)
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard FIPA Interaction Protocol Library
 * @specification SC0002{6..36}, XC00031F, XC00032F — the IP family root
 * @metaclass abstract = true
 * @generalization IClass (UML §11.4) with isAbstract=true. Root abstract
 *   class realised by exactly 11 concrete subclasses, one per FIPA IP.
 * @definition An InteractionProtocol is the abstract root of the 11 FIPA
 *   named coordination protocols. Every concrete subclass binds (a) a
 *   protocolName property whose value is the FIPA-canonical token (e.g.,
 *   "fipa-request", "fipa-contract-net") that fills the protocol parameter
 *   of the ACL message envelope (FIPA SC00061G §3.10), (b) a roles property
 *   listing the IProtocolRole subtypes the protocol's AUML diagram
 *   declares, (c) a pattern property pointing at the ordered sequence of
 *   IProtocolStep instances the diagram authorises, and (d) a
 *   conversationIdRequired flag (always true per FIPA SC00026H §1.1
 *   "Any interaction using this interaction protocol is identified by a
 *   globally unique, non-null conversation-id parameter, assigned by the
 *   Initiator").
 * @ownedAttributes
 *   protocolName:               String [1..1] — UML §9.5 ownedAttribute
 *   roles:                      IProtocolRole [1..*]
 *   pattern:                    IProtocolPattern [1..1]
 *   conversationIdRequired:     Boolean [1..1] (always true)
 *   specSection:                String [1..1] — the SC document & §
 *   specStatus:                 String [1..1] — "Standard" or "Experimental"
 */
export interface IInteractionProtocol extends IElement {
  readonly metaClass: string;
  readonly umlMetaclass: 'Class';
  readonly isAbstract: true;
  readonly protocolName: string;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly conversationIdRequired: true;
  readonly specSection: string;
  readonly specStatus: 'Standard' | 'Experimental';
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 5 — 11 Concrete Interaction Protocol Interfaces
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard FIPA Request Interaction Protocol Specification
 * @specification SC00026H (2002-12-03, Standard)
 * @section §1 — FIPA Request Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-request".
 * @definition Verbatim from SC00026H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Request Interaction Protocol (IP) allows one agent to request
 *   another to perform some action. The Participant processes the request
 *   and makes a decision whether to accept or refuse the request. If a
 *   refuse decision is made, then 'refused' becomes true and the
 *   Participant communicates a refuse. Otherwise, 'agreed' becomes true.
 *   If conditions indicate that an explicit agreement is required (that
 *   is, 'notification necessary' is true), then the Participant
 *   communicates an agree. … Once the request has been agreed upon, then
 *   the Participant must communicate either: a failure if it fails in its
 *   attempt to fill the request, an inform-done if it successfully
 *   completes the request and only wishes to indicate that it is done, or
 *   an inform-result if it wishes to indicate both that it is done and
 *   notify the initiator of the results."
 * @roles Initiator, Participant
 * @performatives request, refuse, agree, failure, inform-done,
 *   inform-result, not-understood, cancel
 * @protocolName fipa-request
 */
export interface IRequestInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'RequestInteractionProtocol';
  readonly protocolName: 'fipa-request';
  readonly specSection: 'SC00026H §1';
  readonly specStatus: 'Standard';
  readonly initiatorPerformative: IPerformativeKindRequest;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Query Interaction Protocol Specification
 * @specification SC00027H (2002-12-03, Standard)
 * @section §1 — FIPA Query Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-query".
 * @definition Verbatim from SC00027H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Query Interaction Protocol (IP) allows one agent to request
 *   another to perform some kind of inform action. … This protocol is
 *   designed to be invoked by either a query-if act, which is verifying
 *   the truth of a given proposition, or a query-ref act, which is
 *   asking for an object referred to by a referential expression. The
 *   Participant processes the query and makes a decision whether to
 *   accept or refuse the query. If a refuse decision is made, then
 *   'refused' becomes true and the Participant communicates a refuse.
 *   Otherwise, 'agreed' becomes true. … Once the query has been agreed
 *   upon, then the Participant must communicate either: a failure if it
 *   fails in its attempt to answer, or an inform with the answer."
 * @roles Initiator, Participant
 * @performatives query-if, query-ref, refuse, agree, failure, inform,
 *   not-understood, cancel
 * @protocolName fipa-query
 */
export interface IQueryInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'QueryInteractionProtocol';
  readonly protocolName: 'fipa-query';
  readonly specSection: 'SC00027H §1';
  readonly specStatus: 'Standard';
  readonly queryIfAlternative: IPerformativeKindQueryIf;
  readonly queryRefAlternative: IPerformativeKindQueryRef;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informAnswer: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Request When Interaction Protocol Specification
 * @specification SC00028H (2002-12-03, Standard)
 * @section §1 — FIPA Request When Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-request-when".
 * @definition Verbatim from SC00028H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Request When Interaction Protocol (IP) is used by an agent to
 *   request another to perform some action when a given precondition,
 *   expressed as a proposition, becomes true. The Participant processes the
 *   request-when and makes a decision whether to accept or refuse the
 *   request. … If a refuse decision is made, the Participant
 *   communicates a refuse. Otherwise, the Participant communicates an
 *   agree. The Participant must remember the request-when until the
 *   precondition becomes true (or the request is cancelled), at which
 *   point the Participant performs the action and communicates an
 *   inform-done, an inform-result, or a failure."
 * @roles Initiator, Participant
 * @performatives request-when, refuse, agree, failure, inform-done,
 *   inform-result, not-understood, cancel
 * @protocolName fipa-request-when
 */
export interface IRequestWhenInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'RequestWhenInteractionProtocol';
  readonly protocolName: 'fipa-request-when';
  readonly specSection: 'SC00028H §1';
  readonly specStatus: 'Standard';
  readonly initiatorPerformative: IPerformativeKindRequestWhen;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Contract Net Interaction Protocol Specification
 * @specification SC00029H (2002-12-03, Standard)
 * @section §1 — FIPA Contract Net Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-contract-net".
 * @definition Verbatim from SC00029H §1.1 Explanation of the Protocol Flow:
 *   "In the FIPA Contract Net Interaction Protocol (IP), one agent (the
 *   Initiator) takes the role of manager which wishes to have some task
 *   performed by one or more other agents (the Participants which take the
 *   role of contractors) and further wishes to optimise a function that
 *   characterises the task. … The Initiator solicits proposals from other
 *   agents by issuing a call for proposals (cfp) act, which specifies the
 *   task, as well as any conditions the Initiator is placing upon the
 *   execution of the task. Participants receiving the cfp are viewed as
 *   potential contractors and are able to generate n responses. Of these,
 *   m are proposals to perform the task, specified as propose acts. The
 *   Participant's proposal includes the preconditions that the Participant
 *   is setting out for the task, which may be the price, the time when
 *   the task will be done, etc. … The Initiator chooses among the
 *   received proposals using accept-proposal and reject-proposal acts."
 * @roles Initiator (= Manager), Participant (= Contractor)
 * @performatives cfp, refuse, propose, accept-proposal, reject-proposal,
 *   failure, inform-done, inform-result, not-understood, cancel
 * @protocolName fipa-contract-net
 */
export interface IContractNetInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'ContractNetInteractionProtocol';
  readonly protocolName: 'fipa-contract-net';
  readonly specSection: 'SC00029H §1';
  readonly specStatus: 'Standard';
  readonly cfpStep: IPerformativeKindCfp;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly proposeAlternative: IPerformativeKindPropose;
  readonly acceptProposalDecision: IPerformativeKindAcceptProposal;
  readonly rejectProposalDecision: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Iterated Contract Net Interaction Protocol Specification
 * @specification SC00030H (2002-12-03, Standard)
 * @section §1 — FIPA Iterated Contract Net Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-iterated-contract-net".
 * @definition Verbatim from SC00030H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Iterated Contract Net Interaction Protocol (IP) is an
 *   extension of the basic Contract Net IP, but differs by allowing
 *   multi-round iterative bidding. … As with the basic Contract Net IP,
 *   the Initiator solicits proposals from other agents by issuing a call
 *   for proposals (cfp) act. … However, in this iterated version, the
 *   Initiator may then iterate the process by issuing a revised cfp to
 *   those Participants that returned proposals (specifying revised
 *   conditions). The process terminates when the Initiator refuses all
 *   proposals and does not issue a new cfp, the Initiator accepts one
 *   or more of the proposals, or the Participants refuse to bid further."
 * @roles Initiator, Participant
 * @performatives cfp, refuse, propose, failure, inform-done,
 *   not-understood, cancel
 * @protocolName fipa-iterated-contract-net
 */
export interface IIteratedContractNetInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'IteratedContractNetInteractionProtocol';
  readonly protocolName: 'fipa-iterated-contract-net';
  readonly specSection: 'SC00030H §1';
  readonly specStatus: 'Standard';
  readonly cfpStep: IPerformativeKindCfp;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly proposeAlternative: IPerformativeKindPropose;
  readonly acceptProposalDecision: IPerformativeKindAcceptProposal;
  readonly rejectProposalDecision: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA English Auction Interaction Protocol Specification
 * @specification XC00031F (2001-08-10, Experimental)
 * @section §1 — FIPA English Auction Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-english-auction".
 * @definition Verbatim from XC00031F §1: "In the English auction the
 *   auctioneer seeks to find the market price of a good by initially
 *   proposing a price below that of the supposed market value, and then
 *   gradually raising the price. Each time the price is announced, the
 *   auctioneer waits to see if any buyers will signal their willingness
 *   to pay the proposed price. As soon as one buyer indicates that it
 *   will accept the price, the auctioneer issues a new call for bids
 *   with an incremented price. The auction continues until no buyers are
 *   prepared to pay the proposed price, at which point the auction ends.
 *   If the last price that was accepted by a buyer exceeds the
 *   auctioneer's (privately known) reservation price, the good is sold to
 *   that buyer for the agreed price."
 * @roles Auctioneer, Bidder
 * @performatives request, cfp, propose, accept-proposal, reject-proposal,
 *   not-understood
 * @protocolName fipa-english-auction
 */
export interface IEnglishAuctionInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'EnglishAuctionInteractionProtocol';
  readonly protocolName: 'fipa-english-auction';
  readonly specSection: 'XC00031F §1';
  readonly specStatus: 'Experimental';
  readonly auctionInitiationRequest: IPerformativeKindRequest;
  readonly cfpAtAscendingPrice: IPerformativeKindCfp;
  readonly proposeBid: IPerformativeKindPropose;
  readonly acceptProposalAward: IPerformativeKindAcceptProposal;
  readonly rejectProposalLosing: IPerformativeKindRejectProposal;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
}

/**
 * @standard FIPA Dutch Auction Interaction Protocol Specification
 * @specification XC00032F (2001-08-10, Experimental)
 * @section §1 — FIPA Dutch Auction Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-dutch-auction".
 * @definition Verbatim from XC00032F §1: "In the Dutch auction the
 *   auctioneer seeks to find the market price of a good by starting bidding
 *   at a price higher than the expected market value, and then continuously
 *   lowering the price until one of the buyers accepts the price. The rate
 *   of lowering the price (the price decrement) is set by the auctioneer.
 *   The bidding ends when one bidder accepts the price, at which point the
 *   good is sold to that bidder for that price. If the auction reaches the
 *   reservation price of the auctioneer (the lowest price for which the
 *   auctioneer will sell the good) without finding a willing buyer, the
 *   auction ends without a sale."
 * @roles Auctioneer, Bidder
 * @performatives request, cfp, propose, accept-proposal, reject-proposal,
 *   not-understood
 * @protocolName fipa-dutch-auction
 */
export interface IDutchAuctionInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'DutchAuctionInteractionProtocol';
  readonly protocolName: 'fipa-dutch-auction';
  readonly specSection: 'XC00032F §1';
  readonly specStatus: 'Experimental';
  readonly auctionInitiationRequest: IPerformativeKindRequest;
  readonly cfpAtDescendingPrice: IPerformativeKindCfp;
  readonly proposeAcceptance: IPerformativeKindPropose;
  readonly acceptProposalAward: IPerformativeKindAcceptProposal;
  readonly rejectProposalLosing: IPerformativeKindRejectProposal;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
}

/**
 * @standard FIPA Brokering Interaction Protocol Specification
 * @specification SC00033H (2002-12-03, Standard)
 * @section §1 — FIPA Brokering Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-brokering".
 * @definition Verbatim from SC00033H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Brokering Interaction Protocol (IP) is used by an Initiator
 *   that wishes to have some action performed by other agents whose
 *   identities are not known to it. The Initiator delegates the task of
 *   identifying suitable agents and forwarding messages to them to a
 *   Broker. … The Broker accepts the proxy request from the Initiator and
 *   identifies the targets that match the referential expression of the
 *   proxy. The Broker then forwards the embedded ACL message to the
 *   identified targets, collects their responses, and returns those
 *   responses to the Initiator."
 * @roles Initiator, Broker, Participant (= the brokered targets)
 * @performatives proxy, refuse, agree, failure, inform-done, inform,
 *   request, not-understood, cancel
 * @protocolName fipa-brokering
 */
export interface IBrokeringInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'BrokeringInteractionProtocol';
  readonly protocolName: 'fipa-brokering';
  readonly specSection: 'SC00033H §1';
  readonly specStatus: 'Standard';
  readonly proxyDelegation: IPerformativeKindProxy;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly forwardedRequest: IPerformativeKindRequest;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Recruiting Interaction Protocol Specification
 * @specification SC00034H (2002-12-03, Standard)
 * @section §1 — FIPA Recruiting Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-recruiting".
 * @definition Verbatim from SC00034H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Recruiting Interaction Protocol (IP) is used by an Initiator
 *   that wishes to have some action performed by other agents whose
 *   identities are not known to it. The Initiator delegates the task of
 *   identifying suitable agents and forwarding messages to them to a
 *   Recruiter. … The Recruiter accepts the proxy request and identifies
 *   the targets matching the proxy's referential expression, then forwards
 *   the embedded ACL message to the identified targets. Unlike the
 *   Brokering protocol, the targets reply directly to the Initiator
 *   rather than via the Recruiter."
 * @roles Initiator, Recruiter, Participant (= the recruited targets)
 * @performatives proxy, refuse, agree, failure, inform-done, inform,
 *   request, not-understood, cancel
 * @protocolName fipa-recruiting
 */
export interface IRecruitingInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'RecruitingInteractionProtocol';
  readonly protocolName: 'fipa-recruiting';
  readonly specSection: 'SC00034H §1';
  readonly specStatus: 'Standard';
  readonly proxyDelegation: IPerformativeKindProxy;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly forwardedRequest: IPerformativeKindRequest;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Subscribe Interaction Protocol Specification
 * @specification SC00035H (2002-12-03, Standard)
 * @section §1 — FIPA Subscribe Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-subscribe".
 * @definition Verbatim from SC00035H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Subscribe Interaction Protocol (IP) allows an agent to
 *   request that another agent perform an action when some condition
 *   becomes true and to do so for as long as the condition continues to
 *   hold or until the subscription is cancelled. … The Initiator sends a
 *   subscribe message to the Participant. The Participant processes the
 *   subscribe request and makes a decision to accept or refuse the
 *   subscription. If accepted, the Participant communicates an agree
 *   and thereafter sends inform messages each time the condition becomes
 *   true, until the Initiator cancels the subscription."
 * @roles Initiator, Participant
 * @performatives subscribe, refuse, agree, failure, inform, inform-done,
 *   inform-result, not-understood, cancel
 * @protocolName fipa-subscribe
 */
export interface ISubscribeInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'SubscribeInteractionProtocol';
  readonly protocolName: 'fipa-subscribe';
  readonly specSection: 'SC00035H §1';
  readonly specStatus: 'Standard';
  readonly subscribeRequest: IPerformativeKindSubscribe;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informNotification: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

/**
 * @standard FIPA Propose Interaction Protocol Specification
 * @specification SC00036H (2002-12-03, Standard)
 * @section §1 — FIPA Propose Interaction Protocol
 * @metaclass abstract = false
 * @generalization IInteractionProtocol — concrete subclass binding
 *   protocolName="fipa-propose".
 * @definition Verbatim from SC00036H §1.1 Explanation of the Protocol Flow:
 *   "The FIPA Propose Interaction Protocol (IP) allows an agent (the
 *   Initiator) to send a proposal to another agent (the Participant) to
 *   perform an action. The Participant processes the propose and makes a
 *   decision whether to accept or reject the proposal. If the proposal is
 *   accepted, the Participant communicates an accept-proposal. If the
 *   proposal is rejected, the Participant communicates a reject-proposal.
 *   This protocol differs from the Request IP in that the Initiator is
 *   offering, rather than requesting, the action."
 * @roles Initiator, Participant
 * @performatives propose, accept-proposal, reject-proposal, failure,
 *   inform-done, not-understood, cancel
 * @protocolName fipa-propose
 */
export interface IProposeInteractionProtocol extends IInteractionProtocol {
  readonly metaClass: 'ProposeInteractionProtocol';
  readonly protocolName: 'fipa-propose';
  readonly specSection: 'SC00036H §1';
  readonly specStatus: 'Standard';
  readonly proposeOffer: IPerformativeKindPropose;
  readonly acceptProposalAlternative: IPerformativeKindAcceptProposal;
  readonly rejectProposalAlternative: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 6 — Witness Implementation Classes
// ───────────────────────────────────────────────────────────────────────────
//
// Each interface declared above admits a minimal data-carrier class that an
// agent runtime (e.g., a JADE-equivalent or a LangGraph orchestrator) may
// instantiate. The witness classes carry only the `elementId` (UML §7.8.6
// Element identity) plus the registry-key references the interface declares
// — they hold no behavior. Behavior is supplied by the consumer (the runtime
// dispatcher reading the `performativeId` foreign key into @amlhubs/fipa-acl).
//
// All witness classes extend the abstract `FipaIpElement` base which
// implements the UML §7.8.6 IElement contract (elementId, ownedCommentIds,
// ownedElementIds, ownerId, allOwnedElements, mustBeOwned). This mirrors the
// `FipaAclElement` discipline used by @amlhubs/fipa-acl.

/**
 * Abstract base for every fipa-ip witness class. Implements the UML §7.8.6
 * IElement contract once, so concrete witnesses only carry the FIPA-IP-
 * specific properties their interface declares.
 */
abstract class FipaIpElement implements IElement {
  readonly elementId: string;
  readonly ownedCommentIds: ReadonlyArray<string>;
  readonly ownedElementIds: ReadonlyArray<string>;
  readonly ownerId: string | undefined;
  protected constructor(init: {
    elementId: string;
    ownedCommentIds?: ReadonlyArray<string>;
    ownedElementIds?: ReadonlyArray<string>;
    ownerId?: string;
  }) {
    this.elementId = init.elementId;
    this.ownedCommentIds = init.ownedCommentIds ?? [];
    this.ownedElementIds = init.ownedElementIds ?? [];
    this.ownerId = init.ownerId;
  }
  allOwnedElements(): ReadonlyArray<string> { return this.ownedElementIds; }
  mustBeOwned(): boolean { return false; }
}

/** @generalization {@link IProtocolRole} — UML §10.2.5 Enumeration witness. */
export class ProtocolRole extends FipaIpElement implements IProtocolRole {
  readonly metaClass = 'ProtocolRole' as const;
  readonly umlMetaclass = 'Enumeration' as const;
  readonly ownedLiteralIds: ReadonlyArray<string>;
  constructor(init: { elementId: string; ownedLiteralIds: ReadonlyArray<string>; ownerId?: string }) {
    super(init);
    this.ownedLiteralIds = init.ownedLiteralIds;
  }
}

/** @generalization {@link IProtocolRoleInitiator} — UML §10.5.5 EnumerationLiteral witness. */
export class ProtocolRoleInitiator extends FipaIpElement implements IProtocolRoleInitiator {
  readonly metaClass = 'ProtocolRoleInitiator' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleParticipant} — UML §10.5.5 EnumerationLiteral witness. */
export class ProtocolRoleParticipant extends FipaIpElement implements IProtocolRoleParticipant {
  readonly metaClass = 'ProtocolRoleParticipant' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleBroker} — UML §10.5.5 EnumerationLiteral witness for SC00033H §1 Broker. */
export class ProtocolRoleBroker extends FipaIpElement implements IProtocolRoleBroker {
  readonly metaClass = 'ProtocolRoleBroker' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleManager} — UML §10.5.5 EnumerationLiteral witness for SC00029H §1 Manager. */
export class ProtocolRoleManager extends FipaIpElement implements IProtocolRoleManager {
  readonly metaClass = 'ProtocolRoleManager' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleContractor} — UML §10.5.5 EnumerationLiteral witness for SC00029H §1 Contractor. */
export class ProtocolRoleContractor extends FipaIpElement implements IProtocolRoleContractor {
  readonly metaClass = 'ProtocolRoleContractor' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleRecruiter} — UML §10.5.5 EnumerationLiteral witness for SC00034H §1 Recruiter. */
export class ProtocolRoleRecruiter extends FipaIpElement implements IProtocolRoleRecruiter {
  readonly metaClass = 'ProtocolRoleRecruiter' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleAuctioneer} — UML §10.5.5 EnumerationLiteral witness for XC00031F/XC00032F §1. */
export class ProtocolRoleAuctioneer extends FipaIpElement implements IProtocolRoleAuctioneer {
  readonly metaClass = 'ProtocolRoleAuctioneer' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolRoleBidder} — UML §10.5.5 EnumerationLiteral witness for XC00031F §1 Bidder. */
export class ProtocolRoleBidder extends FipaIpElement implements IProtocolRoleBidder {
  readonly metaClass = 'ProtocolRoleBidder' as const;
  readonly umlMetaclass = 'EnumerationLiteral' as const;
  readonly enumerationId: string;
  constructor(init: { elementId: string; enumerationId: string; ownerId?: string }) {
    super(init);
    this.enumerationId = init.enumerationId;
  }
}

/** @generalization {@link IProtocolStep} — UML §11.4 Class witness. */
export class ProtocolStep extends FipaIpElement implements IProtocolStep {
  readonly metaClass = 'ProtocolStep' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly senderId: string;
  readonly receiverId: string;
  readonly performativeId: string;
  readonly preconditionId?: string;
  readonly rationalEffectId?: string;
  constructor(init: {
    elementId: string; senderId: string; receiverId: string; performativeId: string;
    preconditionId?: string; rationalEffectId?: string; ownerId?: string;
  }) {
    super(init);
    this.senderId = init.senderId;
    this.receiverId = init.receiverId;
    this.performativeId = init.performativeId;
    this.preconditionId = init.preconditionId;
    this.rationalEffectId = init.rationalEffectId;
  }
}

/** @generalization {@link IProtocolStepSender} — UML §9.5 Property witness. */
export class ProtocolStepSender extends FipaIpElement implements IProtocolStepSender {
  readonly metaClass = 'ProtocolStepSender' as const;
  readonly umlMetaclass = 'Property' as const;
  readonly lower = 1 as const;
  readonly upper = 1 as const;
  readonly classId: string;
  readonly typeId: string;
  constructor(init: { elementId: string; classId: string; typeId: string; ownerId?: string }) {
    super(init);
    this.classId = init.classId;
    this.typeId = init.typeId;
  }
}

/** @generalization {@link IProtocolStepReceiver} — UML §9.5 Property witness; upper may be * for broadcast steps. */
export class ProtocolStepReceiver extends FipaIpElement implements IProtocolStepReceiver {
  readonly metaClass = 'ProtocolStepReceiver' as const;
  readonly umlMetaclass = 'Property' as const;
  readonly lower = 1 as const;
  readonly classId: string;
  readonly typeId: string;
  readonly upper: number;
  constructor(init: { elementId: string; classId: string; typeId: string; upper: number; ownerId?: string }) {
    super(init);
    this.classId = init.classId;
    this.typeId = init.typeId;
    this.upper = init.upper;
  }
}

/** @generalization {@link IProtocolStepPerformative} — UML §9.5 Property witness, FK to @amlhubs/fipa-acl. */
export class ProtocolStepPerformative extends FipaIpElement implements IProtocolStepPerformative {
  readonly metaClass = 'ProtocolStepPerformative' as const;
  readonly umlMetaclass = 'Property' as const;
  readonly lower = 1 as const;
  readonly upper = 1 as const;
  readonly classId: string;
  readonly performativeKindId: string;
  constructor(init: { elementId: string; classId: string; performativeKindId: string; ownerId?: string }) {
    super(init);
    this.classId = init.classId;
    this.performativeKindId = init.performativeKindId;
  }
}

/** @generalization {@link IProtocolStepPrecondition} — UML §7.6 Constraint witness with OpaqueExpression body. */
export class ProtocolStepPrecondition extends FipaIpElement implements IProtocolStepPrecondition {
  readonly metaClass = 'ProtocolStepPrecondition' as const;
  readonly umlMetaclass = 'Constraint' as const;
  readonly stepId: string;
  readonly opaqueExpressionId: string;
  constructor(init: { elementId: string; stepId: string; opaqueExpressionId: string; ownerId?: string }) {
    super(init);
    this.stepId = init.stepId;
    this.opaqueExpressionId = init.opaqueExpressionId;
  }
}

/** @generalization {@link IProtocolStepRationalEffect} — UML §7.6 Constraint witness with OpaqueExpression body. */
export class ProtocolStepRationalEffect extends FipaIpElement implements IProtocolStepRationalEffect {
  readonly metaClass = 'ProtocolStepRationalEffect' as const;
  readonly umlMetaclass = 'Constraint' as const;
  readonly stepId: string;
  readonly opaqueExpressionId: string;
  constructor(init: { elementId: string; stepId: string; opaqueExpressionId: string; ownerId?: string }) {
    super(init);
    this.stepId = init.stepId;
    this.opaqueExpressionId = init.opaqueExpressionId;
  }
}

/** @generalization {@link IProtocolPattern} — UML §11.4 Class witness; ordered Slot of InstanceSpecification of IProtocolStep. */
export class ProtocolPattern extends FipaIpElement implements IProtocolPattern {
  readonly metaClass = 'ProtocolPattern' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly stepSlotIds: ReadonlyArray<string>;
  readonly branchIds: ReadonlyArray<string>;
  constructor(init: { elementId: string; stepSlotIds: ReadonlyArray<string>; branchIds: ReadonlyArray<string>; ownerId?: string }) {
    super(init);
    this.stepSlotIds = init.stepSlotIds;
    this.branchIds = init.branchIds;
  }
}

/** @generalization {@link IProtocolBranch} — UML §7.6 Constraint witness encoding alternative-flow guards. */
export class ProtocolBranch extends FipaIpElement implements IProtocolBranch {
  readonly metaClass = 'ProtocolBranch' as const;
  readonly umlMetaclass = 'Constraint' as const;
  readonly patternId: string;
  readonly guardExpressionId: string;
  readonly stepIds: ReadonlyArray<string>;
  constructor(init: { elementId: string; patternId: string; guardExpressionId: string; stepIds: ReadonlyArray<string>; ownerId?: string }) {
    super(init);
    this.patternId = init.patternId;
    this.guardExpressionId = init.guardExpressionId;
    this.stepIds = init.stepIds;
  }
}

/** @generalization {@link IRequestInteractionProtocol} — SC00026H §1 witness. */
export class RequestInteractionProtocol extends FipaIpElement implements IRequestInteractionProtocol {
  readonly metaClass = 'RequestInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-request' as const;
  readonly specSection = 'SC00026H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly initiatorPerformative: IPerformativeKindRequest;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    initiatorPerformative: IPerformativeKindRequest;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    informResultAlternative: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.initiatorPerformative = init.initiatorPerformative;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.informResultAlternative = init.informResultAlternative;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IQueryInteractionProtocol} — SC00027H §1 witness. */
export class QueryInteractionProtocol extends FipaIpElement implements IQueryInteractionProtocol {
  readonly metaClass = 'QueryInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-query' as const;
  readonly specSection = 'SC00027H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly queryIfAlternative: IPerformativeKindQueryIf;
  readonly queryRefAlternative: IPerformativeKindQueryRef;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informAnswer: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    queryIfAlternative: IPerformativeKindQueryIf;
    queryRefAlternative: IPerformativeKindQueryRef;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informAnswer: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.queryIfAlternative = init.queryIfAlternative;
    this.queryRefAlternative = init.queryRefAlternative;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informAnswer = init.informAnswer;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IRequestWhenInteractionProtocol} — SC00028H §1 witness. */
export class RequestWhenInteractionProtocol extends FipaIpElement implements IRequestWhenInteractionProtocol {
  readonly metaClass = 'RequestWhenInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-request-when' as const;
  readonly specSection = 'SC00028H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly initiatorPerformative: IPerformativeKindRequestWhen;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    initiatorPerformative: IPerformativeKindRequestWhen;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    informResultAlternative: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.initiatorPerformative = init.initiatorPerformative;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.informResultAlternative = init.informResultAlternative;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IContractNetInteractionProtocol} — SC00029H §1 witness. */
export class ContractNetInteractionProtocol extends FipaIpElement implements IContractNetInteractionProtocol {
  readonly metaClass = 'ContractNetInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-contract-net' as const;
  readonly specSection = 'SC00029H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly cfpStep: IPerformativeKindCfp;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly proposeAlternative: IPerformativeKindPropose;
  readonly acceptProposalDecision: IPerformativeKindAcceptProposal;
  readonly rejectProposalDecision: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly informResultAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    cfpStep: IPerformativeKindCfp;
    refuseAlternative: IPerformativeKindRefuse;
    proposeAlternative: IPerformativeKindPropose;
    acceptProposalDecision: IPerformativeKindAcceptProposal;
    rejectProposalDecision: IPerformativeKindRejectProposal;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    informResultAlternative: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.cfpStep = init.cfpStep;
    this.refuseAlternative = init.refuseAlternative;
    this.proposeAlternative = init.proposeAlternative;
    this.acceptProposalDecision = init.acceptProposalDecision;
    this.rejectProposalDecision = init.rejectProposalDecision;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.informResultAlternative = init.informResultAlternative;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IIteratedContractNetInteractionProtocol} — SC00030H §1 witness. */
export class IteratedContractNetInteractionProtocol extends FipaIpElement implements IIteratedContractNetInteractionProtocol {
  readonly metaClass = 'IteratedContractNetInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-iterated-contract-net' as const;
  readonly specSection = 'SC00030H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly cfpStep: IPerformativeKindCfp;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly proposeAlternative: IPerformativeKindPropose;
  readonly acceptProposalDecision: IPerformativeKindAcceptProposal;
  readonly rejectProposalDecision: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    cfpStep: IPerformativeKindCfp;
    refuseAlternative: IPerformativeKindRefuse;
    proposeAlternative: IPerformativeKindPropose;
    acceptProposalDecision: IPerformativeKindAcceptProposal;
    rejectProposalDecision: IPerformativeKindRejectProposal;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.cfpStep = init.cfpStep;
    this.refuseAlternative = init.refuseAlternative;
    this.proposeAlternative = init.proposeAlternative;
    this.acceptProposalDecision = init.acceptProposalDecision;
    this.rejectProposalDecision = init.rejectProposalDecision;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IEnglishAuctionInteractionProtocol} — XC00031F §1 witness. */
export class EnglishAuctionInteractionProtocol extends FipaIpElement implements IEnglishAuctionInteractionProtocol {
  readonly metaClass = 'EnglishAuctionInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-english-auction' as const;
  readonly specSection = 'XC00031F §1' as const;
  readonly specStatus = 'Experimental' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly auctionInitiationRequest: IPerformativeKindRequest;
  readonly cfpAtAscendingPrice: IPerformativeKindCfp;
  readonly proposeBid: IPerformativeKindPropose;
  readonly acceptProposalAward: IPerformativeKindAcceptProposal;
  readonly rejectProposalLosing: IPerformativeKindRejectProposal;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    auctionInitiationRequest: IPerformativeKindRequest;
    cfpAtAscendingPrice: IPerformativeKindCfp;
    proposeBid: IPerformativeKindPropose;
    acceptProposalAward: IPerformativeKindAcceptProposal;
    rejectProposalLosing: IPerformativeKindRejectProposal;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.auctionInitiationRequest = init.auctionInitiationRequest;
    this.cfpAtAscendingPrice = init.cfpAtAscendingPrice;
    this.proposeBid = init.proposeBid;
    this.acceptProposalAward = init.acceptProposalAward;
    this.rejectProposalLosing = init.rejectProposalLosing;
    this.notUnderstoodException = init.notUnderstoodException;
  }
}

/** @generalization {@link IDutchAuctionInteractionProtocol} — XC00032F §1 witness. */
export class DutchAuctionInteractionProtocol extends FipaIpElement implements IDutchAuctionInteractionProtocol {
  readonly metaClass = 'DutchAuctionInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-dutch-auction' as const;
  readonly specSection = 'XC00032F §1' as const;
  readonly specStatus = 'Experimental' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly auctionInitiationRequest: IPerformativeKindRequest;
  readonly cfpAtDescendingPrice: IPerformativeKindCfp;
  readonly proposeAcceptance: IPerformativeKindPropose;
  readonly acceptProposalAward: IPerformativeKindAcceptProposal;
  readonly rejectProposalLosing: IPerformativeKindRejectProposal;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    auctionInitiationRequest: IPerformativeKindRequest;
    cfpAtDescendingPrice: IPerformativeKindCfp;
    proposeAcceptance: IPerformativeKindPropose;
    acceptProposalAward: IPerformativeKindAcceptProposal;
    rejectProposalLosing: IPerformativeKindRejectProposal;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.auctionInitiationRequest = init.auctionInitiationRequest;
    this.cfpAtDescendingPrice = init.cfpAtDescendingPrice;
    this.proposeAcceptance = init.proposeAcceptance;
    this.acceptProposalAward = init.acceptProposalAward;
    this.rejectProposalLosing = init.rejectProposalLosing;
    this.notUnderstoodException = init.notUnderstoodException;
  }
}

/** @generalization {@link IBrokeringInteractionProtocol} — SC00033H §1 witness. */
export class BrokeringInteractionProtocol extends FipaIpElement implements IBrokeringInteractionProtocol {
  readonly metaClass = 'BrokeringInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-brokering' as const;
  readonly specSection = 'SC00033H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly proxyDelegation: IPerformativeKindProxy;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly forwardedRequest: IPerformativeKindRequest;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    proxyDelegation: IPerformativeKindProxy;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    forwardedRequest: IPerformativeKindRequest;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.proxyDelegation = init.proxyDelegation;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.forwardedRequest = init.forwardedRequest;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IRecruitingInteractionProtocol} — SC00034H §1 witness. */
export class RecruitingInteractionProtocol extends FipaIpElement implements IRecruitingInteractionProtocol {
  readonly metaClass = 'RecruitingInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-recruiting' as const;
  readonly specSection = 'SC00034H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly proxyDelegation: IPerformativeKindProxy;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly forwardedRequest: IPerformativeKindRequest;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    proxyDelegation: IPerformativeKindProxy;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    forwardedRequest: IPerformativeKindRequest;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.proxyDelegation = init.proxyDelegation;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.forwardedRequest = init.forwardedRequest;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link ISubscribeInteractionProtocol} — SC00035H §1 witness. */
export class SubscribeInteractionProtocol extends FipaIpElement implements ISubscribeInteractionProtocol {
  readonly metaClass = 'SubscribeInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-subscribe' as const;
  readonly specSection = 'SC00035H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly subscribeRequest: IPerformativeKindSubscribe;
  readonly refuseAlternative: IPerformativeKindRefuse;
  readonly agreeAlternative: IPerformativeKindAgree;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informNotification: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    subscribeRequest: IPerformativeKindSubscribe;
    refuseAlternative: IPerformativeKindRefuse;
    agreeAlternative: IPerformativeKindAgree;
    failureAlternative: IPerformativeKindFailure;
    informNotification: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.subscribeRequest = init.subscribeRequest;
    this.refuseAlternative = init.refuseAlternative;
    this.agreeAlternative = init.agreeAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informNotification = init.informNotification;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

/** @generalization {@link IProposeInteractionProtocol} — SC00036H §1 witness. */
export class ProposeInteractionProtocol extends FipaIpElement implements IProposeInteractionProtocol {
  readonly metaClass = 'ProposeInteractionProtocol' as const;
  readonly umlMetaclass = 'Class' as const;
  readonly isAbstract = true as const;
  readonly protocolName = 'fipa-propose' as const;
  readonly specSection = 'SC00036H §1' as const;
  readonly specStatus = 'Standard' as const;
  readonly conversationIdRequired = true as const;
  readonly roleIds: ReadonlyArray<string>;
  readonly patternId: string;
  readonly proposeOffer: IPerformativeKindPropose;
  readonly acceptProposalAlternative: IPerformativeKindAcceptProposal;
  readonly rejectProposalAlternative: IPerformativeKindRejectProposal;
  readonly failureAlternative: IPerformativeKindFailure;
  readonly informDoneAlternative: IPerformativeKindInform;
  readonly notUnderstoodException: IPerformativeKindNotUnderstood;
  readonly cancelMetaProtocol: IPerformativeKindCancel;
  constructor(init: {
    elementId: string;
    roleIds: ReadonlyArray<string>;
    patternId: string;
    proposeOffer: IPerformativeKindPropose;
    acceptProposalAlternative: IPerformativeKindAcceptProposal;
    rejectProposalAlternative: IPerformativeKindRejectProposal;
    failureAlternative: IPerformativeKindFailure;
    informDoneAlternative: IPerformativeKindInform;
    notUnderstoodException: IPerformativeKindNotUnderstood;
    cancelMetaProtocol: IPerformativeKindCancel;
    ownerId?: string;
  }) {
    super(init);
    this.roleIds = init.roleIds;
    this.patternId = init.patternId;
    this.proposeOffer = init.proposeOffer;
    this.acceptProposalAlternative = init.acceptProposalAlternative;
    this.rejectProposalAlternative = init.rejectProposalAlternative;
    this.failureAlternative = init.failureAlternative;
    this.informDoneAlternative = init.informDoneAlternative;
    this.notUnderstoodException = init.notUnderstoodException;
    this.cancelMetaProtocol = init.cancelMetaProtocol;
  }
}

// END-EXTRACTED-FIPA-IP
// ═══════════════════════════════════════════════════════════════════════════
