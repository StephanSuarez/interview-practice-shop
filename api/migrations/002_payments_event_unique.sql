-- The provider delivers webhooks at least once: the DB guarantees each event is recorded only once.
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_event_id_key ON payments(provider_event_id);
