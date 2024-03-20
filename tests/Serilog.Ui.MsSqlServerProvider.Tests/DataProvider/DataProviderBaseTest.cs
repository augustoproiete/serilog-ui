﻿using FluentAssertions;
using Serilog.Ui.Common.Tests.TestSuites;
using Serilog.Ui.MsSqlServerProvider;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Serilog.Ui.Core.OptionsBuilder;
using Xunit;

namespace MsSql.Tests.DataProvider
{
    [Trait("Unit-Base", "MsSql")]
    public class DataProviderBaseTest : IUnitBaseTests
    {
        [Fact]
        public void It_throws_when_any_dependency_is_null()
        {
            var suts = new List<Func<SqlServerDataProvider>>
            {
                () => new SqlServerDataProvider(null),
            };

            suts.ForEach(sut => sut.Should().ThrowExactly<ArgumentNullException>());
        }

        [Fact]
        public Task It_logs_and_throws_when_db_read_breaks_down()
        {
            var sut = new SqlServerDataProvider(new RelationalDbOptions("dbo").WithConnectionString("connString").WithTable("logs"));

            var assert = () => sut.FetchDataAsync(1, 10);
            return assert.Should().ThrowExactlyAsync<ArgumentException>();
        }
    }
}