﻿using Mongo2Go;
using MongoDB.Driver;
using System;

namespace Serilog.Ui.MongoDbProvider.Tests.Util
{
    public class BaseServiceBuilder : IDisposable
    {
        private bool _disposedValue;

        internal MongoDbRunner _runner;
        internal MongoDbOptions _options;
        internal IMongoClient _client;
        internal IMongoDatabase _database;

        public BaseServiceBuilder(MongoDbOptions options)
        {
            _options = options;
            (_runner, _client) = IntegrationDbGeneration.Generate(options);
            _database = _client.GetDatabase(options.DatabaseName);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposedValue)
            {
                if (disposing)
                {
                    _runner.Dispose();
                }

                _disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
