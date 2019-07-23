package com.gostreamyourself.android;

public class Message {
    public static final int TYPE_MESSAGE = 0;
    public static final int TYPE_LOG = 1;
    public static final int TYPE_ACTION = 2;

    private int type;
    private String username;
    private String message;

    private Message() {

    }

    public int getType() {
        return type;
    };

    public String getMessage() {
        return message;
    };

    public String getUsername() {
        return username;
    };

    public static class Builder {
        private final int type;
        private String username;
        private String message;

        public Builder(int type) {
            this.type = type;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Message build() {
            Message message = new Message();
            message.type = type;
            message.username = username;
            message.message = this.message;
            return message;
        }
    }
}
