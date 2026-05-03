// @amlhubs/fipa-ip — IEEE FIPA Interaction Protocol Library
//
// CMOF-conformant TypeScript projection of the 11 FIPA Interaction Protocols
// (SC0002{6..36}, all 2002-12). Each protocol is a concrete Class extending the
// abstract `InteractionProtocol`; participating roles are typed via
// `ProtocolRole` (Initiator, Participant, Broker, Manager, Contractor); each
// step is a `ProtocolStep` whose `sender`/`receiver` are typed by `ProtocolRole`
// and whose `performative` is a foreign-key reference to the `Performative`
// Enumeration exported by `@amlhubs/fipa-acl`; the legal step sequence is
// realised as a `ProtocolPattern` containing an ordered Slot of
// InstanceSpecification; alternative branches are encoded as Constraint
// instances with OpaqueExpression body.
//
// This file is the single root file for the package. Implementation waves
// INSERT into this file — they never rewrite it, never recreate the header.

// Implementation INSERT zone begins below this line.

export {};
