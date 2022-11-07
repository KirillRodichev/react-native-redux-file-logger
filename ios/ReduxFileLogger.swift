@objc(ReduxFileLogger)
class ReduxFileLogger: NSObject {
    var loggers = [String : OsLogLogger]()
    
    @objc(addLogger:withFileConfig:withResolver:withRejecter:)
    func addLogger(
        tag: String,
        rawFileConfig: [String: String],
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        withPromise(resolve: resolve, reject: reject) {
            let logger = try OsLogLogger(tag: tag, rawFileConfig: rawFileConfig)
            try logger.redirectOsLogToNewFile()
            loggers[tag] = logger

            return tag
        }
    }
    
    @objc(archive:withTag:withResolver:withRejecter:)
    func archive(
        rawFileConfig: [String: String],
        tag: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        withPromise(resolve: resolve, reject: reject) {
            let zipFileUrl = try FileCreator(rawFileConfig: rawFileConfig).create(shouldCreateFile: false)
            var archivingLoggers: [String : OsLogLogger] = self.loggers

            if (tag != nil) {
                let logger = self.loggers[tag!]
                if (logger != nil) {
                    archivingLoggers = [tag!: logger!]
                } else {
                    throw RFLError.logger(LoggerError.notFound(tag: tag!))
                }
            }
            
            let compressor = Compressor()
            try compressor.archive(
                fileUrls: archivingLoggers.values.map { $0.fileUrl! },
                archiveUrl: zipFileUrl
            )

            try archivingLoggers.values.forEach { try $0.redirectOsLogToNewFile() }

            return zipFileUrl.path
        }
    }
    
    @objc(log:withMessage:)
    func log(tag: String, message: String) -> Void {
        loggers[tag]?.log(message: message)
    }
}
