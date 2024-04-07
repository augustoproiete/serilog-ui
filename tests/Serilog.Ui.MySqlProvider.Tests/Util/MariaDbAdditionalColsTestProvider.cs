﻿using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using MySql.Tests.Util;
using Serilog.Ui.Core.Attributes;
using Serilog.Ui.MySqlProvider;
using Xunit;

namespace MySql.Tests;

[CollectionDefinition(nameof(MariaDbAdditionalColsTestProvider))]
public class MariaDbCollection : ICollectionFixture<MariaDbAdditionalColsTestProvider>
{
}

public sealed class MariaDbAdditionalColsTestProvider : MariaDbTestProvider<MariaDbTestModel>
{
    protected override Dictionary<string, string>? PropertiesToColumnsMapping => new()
    {
        ["Level"] = "LogLevel",
        ["Message"] = "Message",
        ["MessageTemplate"] = "MessageTemplate",
        ["Properties"] = "Properties",
        ["Timestamp"] = "Timestamp",
        ["SampleBool"] = "SampleBool",
        ["SampleDate"] = "SampleDate",
        ["EnvironmentName"] = "EnvironmentName",
        ["EnvironmentUserName"] = "EnvironmentUserName",
    };
}

public class MariaDbTestModel : MySqlLogModel
{
    public DateTime SampleDate { get; set; }

    public string SampleBool { get; set; } = string.Empty;

    [CodeColumn(CodeType.Json)]
    public string EnvironmentName { get; set; } = string.Empty;

    public string EnvironmentUserName { get; set; } = string.Empty;

    [JsonIgnore]
    public override string Exception { get; set; } = string.Empty;
}