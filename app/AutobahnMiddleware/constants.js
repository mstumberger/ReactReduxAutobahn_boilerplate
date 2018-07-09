export const isConnected = (props) => props.autobahnConnection.connection.isConnected;
export const isSubscribed = (props, topic) => props.autobahnConnection.subscriptions.filter((s) => s.topic === topic).length > 0;

/* RPC CALLS */

export const LINE_ADMIN_SETTINGS = 'com.ledinek.control.line_admin_settings';
export const SHIFT_STATISTICS = 'com.ledinek.database.calculate_shift_statistics';

/* PUB/SUB */

export const STATISTICS_UPDATE_PUBSUB = 'com.ledinek.rpc.statistics_update';
