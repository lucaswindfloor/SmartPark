package com.smartcampus.core.event;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

/**
 * Placeholder for Event Publisher (e.g., using Spring Events or Kafka/RabbitMQ)
 */
@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public void publish(Object event) {
        // TODO: Implement custom event publishing if needed (e.g., to Kafka/RabbitMQ)
        // For now, using Spring's built-in publisher
        applicationEventPublisher.publishEvent(event);
        System.out.println("Published event: " + event.getClass().getSimpleName());
    }
} 