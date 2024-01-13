﻿namespace Serilog.Ui.PostgreSqlProvider;

internal class PostgreSqlSinkColumnNames : SinkColumnNames
{
    public PostgreSqlSinkColumnNames()
    {
        RenderedMessage = "message";
        MessageTemplate = "message_template";
        Level = "level";
        Timestamp = "timestamp";
        Exception = "exception";
        LogEventSerialized = "log_event";
    }
}