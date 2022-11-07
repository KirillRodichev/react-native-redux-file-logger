import Foundation


class FileCreator {
    private let fManager = FileManager.default
    private let rootDir: String, nestedDir: String?, fileName: String
    private let supportedSearchPathDirs : [String : FileManager.SearchPathDirectory] = [
        "Documents": .documentDirectory,
        "Downloads": .downloadsDirectory,
        "AppSupportFiles": .applicationSupportDirectory,
        "Cache": .cachesDirectory,
    ]

    init(rawFileConfig: [String: String]) throws {
        let (rootDir: rootDir, nestedDir: nestedDir, fileName: fileName) = try FileConfigReader(rawFileConfig: rawFileConfig).read()
        self.rootDir = rootDir
        self.nestedDir = nestedDir
        self.fileName = fileName
    }

    public func create(shouldCreateFile: Bool = true) throws -> URL {
        let rootDirUrl = try self.getRootDirUrl()
        let nestedDirUrl = try self.createNestedDirIfNotExists(rootDirUrl: rootDirUrl)
        let dirUrl = nestedDirUrl != nil ? nestedDirUrl! : rootDirUrl
        let fileUrl = dirUrl.appendingPathComponent(self.fileName)
        
        try self.removeIfExists(fileUrl: fileUrl)
        if (shouldCreateFile) {
            try self.createFile(fileUrl: fileUrl)
        }

        return fileUrl
    }

    private func getRootDirUrl() throws -> URL {
        let rootDirUrlFor = supportedSearchPathDirs[self.rootDir]

        if rootDirUrlFor != nil {
            return try self.fManager.url(
                for: rootDirUrlFor!,
                in: .userDomainMask,
                appropriateFor: nil,
                create: true
            )
        }

        return URL(fileURLWithPath: self.rootDir)
    }

    private func createNestedDirIfNotExists(rootDirUrl: URL) throws -> URL? {
        let nestedDirUrl = nestedDir != nil ? rootDirUrl.appendingPathComponent(self.nestedDir!) : nil
        
        if nestedDirUrl != nil && !self.fManager.fileExists(atPath: nestedDirUrl!.path) {
            try self.fManager.createDirectory(
                at: nestedDirUrl!,
                withIntermediateDirectories: true,
                attributes: nil
            )
        }
        
        return nestedDirUrl;
    }
    
    private func removeIfExists(fileUrl: URL) throws -> Void {
        if self.fManager.fileExists(atPath: fileUrl.path) {
            try self.fManager.removeItem(atPath: fileUrl.path)
        }
    }
    
    private func createFile(fileUrl: URL) throws -> Void {
        self.fManager.createFile(atPath: fileUrl.path, contents: nil, attributes: nil)
    }
}
