port: {{ envOrDefault "PORT" "3000" }}
log:
    level: {{ envOrDefault "LOG_LEVEL" "info" }}
kafka:
    broker: {{ envOrDefault "KAFKA_BROKER" "tsgs-saas.wwest.local:9092" }}
    downlinkTopic: {{ envOrDefault "DOWNLINK_TOPIC" "gc-downlink" }}
    droneManagerGroupId:  {{ envOrDefault "DRONE_MANAGER_GROUP_ID" "drone-manager" }}
    entityPublishTopic: {{ envOrDefault "ENTITY_PUBLISH_TOPIC" "mongodb_source.tsgsdb.drones" }}
    constraintTopic: {{ envOrDefault "FLIGHT_CONSTRAINT_TOPIC" "flight.constraint.cmd.0" }}
redis:
    url: redis://:{{ env "REDISDB_PASSWORD" }}@{{ env "REDISDB_ENDPOINT" }}
flightDroneGateway:
    baseUrl: http://{{ envOrDefault "FLIGHT_DRONE_GATEWAY_URL" "flight-drone-gw:3000" }}
