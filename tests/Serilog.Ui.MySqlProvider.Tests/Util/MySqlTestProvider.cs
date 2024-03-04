﻿using Ardalis.GuardClauses;
using Dapper;
using MySql.Data.MySqlClient;
using Serilog.Ui.Common.Tests.DataSamples;
using Serilog.Ui.Common.Tests.SqlUtil;
using Serilog.Ui.Core;
using Serilog.Ui.MySqlProvider;
using System.Threading.Tasks;
using Testcontainers.MySql;
using Xunit;

namespace MySql.Tests.Util
{
    [CollectionDefinition(nameof(MySqlDataProvider))]
    public class MySqlCollection : ICollectionFixture<MySqlTestProvider> { }

    public sealed class MySqlTestProvider : DatabaseInstance
    {
        protected override string Name => nameof(MySqlContainer);
        public MySqlTestProvider()
        {
            Container = new MySqlBuilder().Build();
        }

        public RelationalDbOptions DbOptions { get; set; } = new()
        {
            TableName = "Logs",
            Schema = "dbo"
        };

        protected override async Task CheckDbReadinessAsync()
        {
            Guard.Against.Null(Container);

            DbOptions.ConnectionString = (Container as MySqlContainer)?.GetConnectionString();

            await using var dataContext = new MySqlConnection(DbOptions.ConnectionString);

            await dataContext.ExecuteAsync("SELECT 1");
        }

        protected override async Task InitializeAdditionalAsync()
        {
            var logs = LogModelFaker.Logs(100);
            Collector = new LogModelPropsCollector(logs);

            await using var dataContext = new MySqlConnection(DbOptions.ConnectionString);

            await dataContext.ExecuteAsync(Costants.MySqlCreateTable);

            await dataContext.ExecuteAsync(Costants.MySqlInsertFakeData, logs);

            Provider = new MySqlDataProvider(DbOptions);
        }

    }
}
