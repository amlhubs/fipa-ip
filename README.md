# @amlhubs/fipa-ip — FIPA Interaction Protocol Library as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | IEEE FIPA Interaction Protocol Library (11 named protocols) |
| Specifications | FIPA SC0002{6..36}, all 2002-12 (frozen Standard status) |
| Authority | [IEEE Computer Society Standards Activities Board](https://sagroups.ieee.org/csabsc/standards-activities/) — FIPA standards committee |
| Spec Index | [http://www.fipa.org/repository/ips.php3](http://www.fipa.org/repository/ips.php3) |
| npm Package | `@amlhubs/fipa-ip` |
| npm Version | `0.0.1` |
| Peer Dependencies | `@amlhubs/fipa-acl ^0.0.1`, `@amlhubs/uml ^0.0.2`, `@amlhubs/ocl ^0.0.1` |
| License | MIT |

## Abstract

The FIPA Interaction Protocol Library is the IEEE-standardized catalogue of named, multi-step coordination protocols that two-or-more software agents use to synchronize work over a typed message envelope. Each protocol fixes the legal sequence of FIPA ACL communicative acts ([Performative](http://www.fipa.org/specs/fipa00037/SC00037J.html)) that the participating roles may exchange, the cancellation and timeout pathways, and the rational-effect each step commits the sender to. Together, the 11 protocols cover the standard repertoire of agent coordination: directed task delegation (Request, Request-When), information exchange (Query), market-style allocation (Contract Net, Iterated Contract Net, English Auction, Dutch Auction), intermediation (Brokering, Recruiting), publish-subscribe (Subscribe), and counter-offer negotiation (Propose).

The `@amlhubs/fipa-ip` npm package projects the 11 FIPA Interaction Protocol Specifications onto a CMOF-compliant TypeScript surface. Each protocol becomes a concrete `Class` extending the abstract `InteractionProtocol`; the participating roles become `EnumerationLiteral` values plus typed `Class` realisations of `ProtocolRole` (Initiator, Participant, Broker, Manager, Contractor); each protocol step becomes a `ProtocolStep` `Class` whose `sender` and `receiver` are typed by `ProtocolRole` and whose `performative` is a foreign-key reference to the [`Performative`](http://www.fipa.org/specs/fipa00037/SC00037J.html) `Enumeration` exported by `@amlhubs/fipa-acl`; the legal step sequence is realised as a `ProtocolPattern` containing an ordered `Slot` of `InstanceSpecification`; and alternative branches are encoded as `Constraint` instances with `OpaqueExpression` body. Every JSDoc header cites the precise FIPA SC document and section the metaclass derives from, making each symbol an auditable projection of the IEEE specification rather than an internal invention.

## Specifications Surfaced

The package projects the following 11 FIPA Interaction Protocol Specifications:

| # | Protocol | Specification | URL |
|---|---|---|---|
| 1 | Request Interaction Protocol | FIPA SC00026H, 2002-12-03 | http://www.fipa.org/specs/fipa00026/SC00026H.html |
| 2 | Query Interaction Protocol | FIPA SC00027H, 2002-12-03 | http://www.fipa.org/specs/fipa00027/SC00027H.html |
| 3 | Request-When Interaction Protocol | FIPA SC00028H, 2002-12-03 | http://www.fipa.org/specs/fipa00028/SC00028H.html |
| 4 | Contract Net Interaction Protocol | FIPA SC00029H, 2002-12-03 | http://www.fipa.org/specs/fipa00029/SC00029H.html |
| 5 | Iterated Contract Net Interaction Protocol | FIPA SC00030H, 2002-12-03 | http://www.fipa.org/specs/fipa00030/SC00030H.html |
| 6 | English Auction Interaction Protocol | FIPA SC00031, 2002-12-03 | http://www.fipa.org/specs/fipa00031/ |
| 7 | Dutch Auction Interaction Protocol | FIPA SC00032, 2002-12-03 | http://www.fipa.org/specs/fipa00032/ |
| 8 | Brokering Interaction Protocol | FIPA SC00033, 2002-12-03 | http://www.fipa.org/specs/fipa00033/ |
| 9 | Recruiting Interaction Protocol | FIPA SC00034, 2002-12-03 | http://www.fipa.org/specs/fipa00034/ |
| 10 | Subscribe Interaction Protocol | FIPA SC00035, 2002-12-03 | http://www.fipa.org/specs/fipa00035/ |
| 11 | Propose Interaction Protocol | FIPA SC00036H, 2002-12-03 | http://www.fipa.org/specs/fipa00036/SC00036H.html |

## Business Value — Why Extending This Metamodel Pays Off

Adopting the FIPA Interaction Protocol Library as a typed metamodel converts a category of recurring agentic-software-development engineering — "design the call/response/timeout/cancel state machine for this multi-agent task" — into a one-line declaration that names a standard protocol and lets the typed metamodel enforce its message sequencing. An agentic team that orchestrates work across multiple specialized agents (planner, coder, reviewer, deployer) instantiates `ContractNetInteractionProtocol` once and the type system verifies, at compile time, that no participant emits a `Performative` outside the protocol's legal step set, that timeouts and cancellations are handled, and that the conversation-id binding is preserved across all messages of the conversation.

The IEEE/FIPA pedigree converts internal architectural decisions into externally legible artefacts. A regulated venture — a healthcare model-based-systems-engineering shop subject to ISO 13485, an aerospace integrator subject to ARP4754A, a financial-services platform subject to ISO 20022 — can cite IEEE FIPA SC0002{6..36} directly in its protocol-conformance documentation and treat the TypeScript surface as the executable artefact of that citation. Every multi-agent conversation produced by the platform is a recognisable instance of a published, dated, named standard protocol rather than a bespoke saga whose legitimacy must be argued from scratch.

The third lever is agentic runtime leverage. Ageni's Probabilistic Reduction Engine consumes the FIPA-IP metamodel as the deterministic substrate over which large-language-model agent reasoning operates. When an agent emits an `ACLMessage` whose `performative` does not appear in the current protocol step's allowed set, the TypeScript compiler rejects the call at the same moment it rejects any other type error — protocol violations cannot slip past compile time. The reasoning surface for "what message can I emit next" is reduced from the open set of all 22 communicative acts to the closed set the protocol's current step admits, and the agent's choice space is bounded by the metamodel rather than the prompt.

The fourth lever is composability across the OMG/IEEE specification stack. `@amlhubs/fipa-ip` builds on `@amlhubs/fipa-acl` (typed performatives + message envelope), which in turn builds on `@amlhubs/uml` (Class, Property, Enumeration, Generalization, Constraint), `@amlhubs/sbvr` (the precondition / rational-effect language slot can host an SBVR formulation), and `@amlhubs/ocl` (transition guards). The resulting stack is one coherent metamodeling surface for typed agent-coordination — a venture that adopts this stack does not need to reconcile four loosely-coupled vocabularies for "what an agent says", "how agents coordinate", "what rules govern that coordination", and "what constraints guard each transition".

## Scope — What the Package Surfaces

The package exports the following metaclasses, each a single CMOF-conformant TypeScript declaration carrying a JSDoc header citing its FIPA source:

| Layer | Metaclass | Cites |
|---|---|---|
| Abstract base | `InteractionProtocol` | FIPA Architecture Overview + each SC0002{6..36} §1 |
| Role enumeration | `ProtocolRole` (Initiator, Participant, Broker, Manager, Contractor) | SC0002{6..36} §3 |
| Step | `ProtocolStep` (`sender: ProtocolRole`, `receiver: ProtocolRole`, `performative: Performative`, `precondition: Constraint`, `rationalEffect: Constraint`) | SC0002{6..36} §3 |
| Pattern | `ProtocolPattern` (`steps: Slot[]`, `branches: Constraint[]`) | SC0002{6..36} §3 (AUML diagrams) |
| Concrete protocol 1 | `RequestInteractionProtocol` | SC00026H |
| Concrete protocol 2 | `QueryInteractionProtocol` | SC00027H |
| Concrete protocol 3 | `RequestWhenInteractionProtocol` | SC00028H |
| Concrete protocol 4 | `ContractNetInteractionProtocol` | SC00029H |
| Concrete protocol 5 | `IteratedContractNetInteractionProtocol` | SC00030H |
| Concrete protocol 6 | `EnglishAuctionInteractionProtocol` | SC00031 |
| Concrete protocol 7 | `DutchAuctionInteractionProtocol` | SC00032 |
| Concrete protocol 8 | `BrokeringInteractionProtocol` | SC00033 |
| Concrete protocol 9 | `RecruitingInteractionProtocol` | SC00034 |
| Concrete protocol 10 | `SubscribeInteractionProtocol` | SC00035 |
| Concrete protocol 11 | `ProposeInteractionProtocol` | SC00036H |

The full type surface lives in [`fipa-ip.ts`](./fipa-ip.ts).

## Dependency Topology

```
@amlhubs/uml      (CMOF Kernel — Class, Property, Enumeration, Generalization, Constraint)
      ▲
      │ peerDependency
      ├── @amlhubs/ocl   (transition guards on protocol steps)
      │
      └── @amlhubs/fipa-acl   (Performative enum + ACLMessage envelope)
                ▲
                │ peerDependency
                └── @amlhubs/fipa-ip   (THIS PACKAGE — 11 named coordination protocols)
```

## Installation & Usage

```bash
npm install @amlhubs/fipa-ip
```

```typescript
import {
  InteractionProtocol,
  ContractNetInteractionProtocol,
  ProtocolRole,
  ProtocolStep,
} from '@amlhubs/fipa-ip';
import { Performative } from '@amlhubs/fipa-acl';

// Instantiate a Contract Net coordination between an Initiator and N Participants.
const protocol = new ContractNetInteractionProtocol({
  elementId: 'CMOF_Protocol_ContractNet_42',
  name: 'fipa-contract-net',
  conversationId: 'conv-001',
});
```

## Provenance & Formal References

- [FIPA Interaction Protocols index](http://www.fipa.org/repository/ips.php3)
- [FIPA standard specifications repository](http://www.fipa.org/repository/standardspecs.html)
- [IEEE Computer Society Standards Activities Board](https://sagroups.ieee.org/csabsc/standards-activities/)
- [FIPA SC00026H Request Interaction Protocol](http://www.fipa.org/specs/fipa00026/SC00026H.html)
- [FIPA SC00027H Query Interaction Protocol](http://www.fipa.org/specs/fipa00027/SC00027H.html)
- [FIPA SC00028H Request-When Interaction Protocol](http://www.fipa.org/specs/fipa00028/SC00028H.html)
- [FIPA SC00029H Contract Net Interaction Protocol](http://www.fipa.org/specs/fipa00029/SC00029H.html)
- [FIPA SC00030H Iterated Contract Net Interaction Protocol](http://www.fipa.org/specs/fipa00030/SC00030H.html)
- [FIPA SC00031 English Auction Interaction Protocol](http://www.fipa.org/specs/fipa00031/)
- [FIPA SC00032 Dutch Auction Interaction Protocol](http://www.fipa.org/specs/fipa00032/)
- [FIPA SC00033 Brokering Interaction Protocol](http://www.fipa.org/specs/fipa00033/)
- [FIPA SC00034 Recruiting Interaction Protocol](http://www.fipa.org/specs/fipa00034/)
- [FIPA SC00035 Subscribe Interaction Protocol](http://www.fipa.org/specs/fipa00035/)
- [FIPA SC00036H Propose Interaction Protocol](http://www.fipa.org/specs/fipa00036/SC00036H.html)

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | 2026-05-03 | Initial publish — 11 FIPA Interaction Protocols (SC0002{6..36}) projected onto CMOF Class + ProtocolRole + ProtocolStep + ProtocolPattern surface, peer-depending on @amlhubs/fipa-acl Performative + ACLMessage |

## License

MIT.
