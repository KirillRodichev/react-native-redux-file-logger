enum LoggerError {
    case notFound(tag: String)
    
    var code: String {
        switch self {
        case .notFound:
            return "not-found"
        }
    }
    
    var message: String {
        switch self {
        case let .notFound(tag: tag):
            return "Logger with tag = \"\(tag)\" not found!"
        }
    }
}

enum ArchivingError {
    case createionFailed(archivePath: String)
    
    var code: String {
        switch self {
        case .createionFailed:
            return "creation-failure"
        }
    }
    
    var message: String {
        switch self {
        case let .createionFailed(archivePath: path):
            return "Filed to create archive at \(path)"
        }
    }
}

enum FileConfigurationError: String {
    case incomplete = "incomplete-file-configuration"

    var code: String {
      return rawValue
    }
    
    var message: String {
        switch self {
        case .incomplete:
            return "Incomplete file configuration provided"
        }
    }
}

enum RFLError: Error {
    case logger(_ id: LoggerError)
    case archiving(_ id: ArchivingError)
    case fileConfiguration(_ id: FileConfigurationError)
    case unknown(message: String? = nil)
    
    var code: String {
      switch self {
      case let .logger(id: id):
        return "logger/\(id.code)"
      case let .archiving(id: id):
        return "archiving/\(id.code)"
      case let .fileConfiguration(id: id):
        return "fileConfiguration/\(id.code)"
      case .unknown:
        return "unknown/unknown"
      }
    }

    var message: String {
        switch self {
        case let .logger(id: id):
            return id.message
        case let .archiving(id: id):
            return id.message
        case let .fileConfiguration(id: id):
            return id.message
        case let .unknown(message: message):
          return message ?? "An unexpected error occured."
        }
    }
}
