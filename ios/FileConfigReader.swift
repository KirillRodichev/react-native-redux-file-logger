enum FileConfigKeys : String {
     case RootDir = "rootDir", NestedDir = "nestedDir", FileName = "fileName"
}

class FileConfigReader {
    private let rootDir: String
    private let nestedDir: String?
    private let fileName: String

    init(rawFileConfig: [String: String]) throws {
        if (
            rawFileConfig[FileConfigKeys.RootDir.rawValue] == nil ||
            rawFileConfig[FileConfigKeys.FileName.rawValue] == nil
        ) {
            throw RFLError.fileConfiguration(FileConfigurationError.incomplete)
        }
        rootDir = rawFileConfig[FileConfigKeys.RootDir.rawValue]!
        nestedDir = rawFileConfig[FileConfigKeys.NestedDir.rawValue]
        fileName = rawFileConfig[FileConfigKeys.FileName.rawValue]!
    }

    func read() -> (rootDir: String, nestedDir: String?, fileName: String) {
        return (rootDir: rootDir, nestedDir: nestedDir, fileName: fileName)
    }
}
